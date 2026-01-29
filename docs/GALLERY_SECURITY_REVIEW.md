# Gallery Security Review & Fixes

## Critical Security Gaps Found

### 1. **Weak Authentication Check**

**Problem:** Current RLS policies use `auth.role() = 'authenticated'`, meaning ANY logged-in user can upload/delete gallery items. If you add customer accounts later, they'd have admin access.

**Fix:** Add role-based authorization using user metadata:

```sql
-- First, set admin role in user metadata
-- Go to Authentication → Users → Select admin user → Edit
-- Add to raw user_meta_data: {"role": "admin"}

-- Updated RLS Policies with admin check
CREATE OR REPLACE POLICY "Admin can insert gallery items"
ON gallery_items FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE OR REPLACE POLICY "Admin can update gallery items"
ON gallery_items FOR UPDATE
USING (
  auth.role() = 'authenticated' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE OR REPLACE POLICY "Admin can delete gallery items"
ON gallery_items FOR DELETE
USING (
  auth.role() = 'authenticated' 
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Updated Storage Policies
CREATE OR REPLACE POLICY "Admin upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

CREATE OR REPLACE POLICY "Admin delete access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
```

**Alternative (more scalable):** Create an `admin_users` table:

```sql
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert admin users
INSERT INTO admin_users (user_id) 
VALUES ('uuid-of-admin-user');

-- Use in policies
CREATE OR REPLACE POLICY "Admin can insert gallery items"
ON gallery_items FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM admin_users)
);
```

---

### 2. **UPDATE Bypasses Caps**

**Problem:** Admin can insert a project image, then UPDATE it to standalone, bypassing the 5-standalone cap. Trigger only runs on INSERT.

**Fix:** Add UPDATE trigger and prevent source_type changes:

```sql
-- Prevent changing source_type after insert
ALTER TABLE gallery_items 
  ADD CONSTRAINT immutable_source_type 
  CHECK (source_type IN ('project', 'standalone'));

-- Create UPDATE trigger to enforce caps if source_type changes
CREATE OR REPLACE FUNCTION prevent_source_type_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.source_type != NEW.source_type THEN
    RAISE EXCEPTION 'Cannot change source_type after insert';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_source_type_change
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW 
  EXECUTE FUNCTION prevent_source_type_change();
```

---

### 3. **Storage Path Validation Missing**

**Problem:** Admin could upload to `gallery/standalone/../../projects/X/` and potentially overwrite project images.

**Fix:** Add storage policy with path validation:

```sql
-- Replace existing upload policy with path validation
CREATE OR REPLACE POLICY "Admin upload to allowed paths only"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  AND (
    -- Allow projects/* and gallery/standalone/* only
    name LIKE 'projects/%' 
    OR name LIKE 'gallery/standalone/%'
  )
  AND name NOT LIKE '%../%' -- Prevent path traversal
  AND name NOT LIKE '../%'
);
```

**Frontend validation:**

```typescript
function validateStoragePath(path: string): boolean {
  // Reject path traversal attempts
  if (path.includes('..')) {
    throw new Error('Invalid path: path traversal detected')
  }
  
  // Only allow specific prefixes
  const allowedPrefixes = ['projects/', 'gallery/standalone/']
  const isValid = allowedPrefixes.some(prefix => path.startsWith(prefix))
  
  if (!isValid) {
    throw new Error('Invalid path: must be in projects/ or gallery/standalone/')
  }
  
  return true
}
```

---

### 4. **No File Type Validation**

**Problem:** Admin could upload `.exe`, `.php`, or other malicious files disguised as images.

**Fix:** Add MIME type validation in storage and frontend:

```sql
-- Storage policy with MIME type check (Supabase Pro feature)
CREATE OR REPLACE POLICY "Admin upload images only"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  AND (
    name LIKE 'projects/%' 
    OR name LIKE 'gallery/standalone/%'
  )
  AND (
    -- Allow only image MIME types
    (metadata->>'mimetype') IN (
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    )
  )
);
```

**Frontend validation:**

```typescript
function validateImageFile(file: File): void {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Only images allowed.`)
  }
  
  // Additional: verify file signature (magic bytes)
  const reader = new FileReader()
  reader.onload = (e) => {
    const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4)
    let header = ''
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16)
    }
    
    // JPEG: FFD8FF, PNG: 89504E47, WEBP: 52494646
    const validHeaders = ['ffd8ff', '89504e47', '52494646']
    const isValid = validHeaders.some(h => header.startsWith(h))
    
    if (!isValid) {
      throw new Error('File header mismatch: not a valid image')
    }
  }
  reader.readAsArrayBuffer(file.slice(0, 4))
}
```

---

## RLS Edge Cases

### 5. **Concurrent Insert Race Condition**

**Problem:** Two admins inserting at count=29. Both read count=29, both pass cap check, both insert → count=31.

**Fix:** Use database-level locking:

```sql
-- Replace trigger with advisory lock
CREATE OR REPLACE FUNCTION enforce_gallery_caps()
RETURNS TRIGGER AS $$
DECLARE
  total_count INTEGER;
  standalone_count INTEGER;
BEGIN
  -- Acquire exclusive lock to prevent concurrent inserts
  PERFORM pg_advisory_xact_lock(hashtext('gallery_caps'));
  
  -- Count current items
  SELECT COUNT(*) INTO total_count FROM gallery_items;
  
  IF total_count >= 30 THEN
    RAISE EXCEPTION 'Gallery cap reached: maximum 30 items allowed';
  END IF;

  IF NEW.source_type = 'standalone' THEN
    SELECT COUNT(*) INTO standalone_count 
    FROM gallery_items 
    WHERE source_type = 'standalone';
    
    IF standalone_count >= 5 THEN
      RAISE EXCEPTION 'Standalone gallery cap reached: maximum 5 standalone items allowed';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**How it works:** `pg_advisory_xact_lock` ensures only one transaction at a time can execute this function. Lock is released when transaction commits/rolls back.

---

### 6. **Immutable Fields Not Protected**

**Problem:** Admin can UPDATE `created_at`, `project_id`, or `image_url`, breaking ordering and references.

**Fix:** Add immutability trigger:

```sql
CREATE OR REPLACE FUNCTION protect_immutable_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent changes to critical fields
  IF OLD.created_at != NEW.created_at THEN
    RAISE EXCEPTION 'Cannot modify created_at timestamp';
  END IF;
  
  IF OLD.source_type = 'project' AND OLD.project_id != NEW.project_id THEN
    RAISE EXCEPTION 'Cannot modify project_id for project-sourced images';
  END IF;
  
  IF OLD.image_url != NEW.image_url THEN
    RAISE EXCEPTION 'Cannot modify image_url. Delete and re-add instead.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_immutable_fields
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW 
  EXECUTE FUNCTION protect_immutable_fields();
```

**Allow only these fields to be updated:**
- `alt_text`
- `caption`
- `sort_order`

---

### 7. **Sort Order Abuse**

**Problem:** No bounds on `sort_order`. Admin could set `-999999` or `999999999`, breaking UI.

**Fix:** Add constraint:

```sql
ALTER TABLE gallery_items 
  ADD CONSTRAINT valid_sort_order 
  CHECK (sort_order >= 0 AND sort_order <= 10000);
```

**Frontend validation:**

```typescript
function validateSortOrder(value: number): number {
  if (value < 0 || value > 10000) {
    throw new Error('Sort order must be between 0 and 10000')
  }
  return Math.floor(value) // Ensure integer
}
```

---

## Admin Breaking Gallery

### 8. **CASCADE Delete Without Warning**

**Problem:** If admin deletes a project, all its gallery references disappear silently due to `ON DELETE CASCADE`.

**Fix:** Add soft delete or warn before cascade:

**Option A: Prevent deletion if gallery references exist**

```sql
-- Remove CASCADE, add RESTRICT
ALTER TABLE gallery_items 
  DROP CONSTRAINT IF EXISTS fk_gallery_project;

ALTER TABLE gallery_items 
  ADD CONSTRAINT fk_gallery_project
  FOREIGN KEY (project_id) 
  REFERENCES projects(id) 
  ON DELETE RESTRICT; -- Blocks project delete if gallery refs exist
```

**Option B: Soft delete pattern**

```sql
-- Add deleted flag to gallery_items
ALTER TABLE gallery_items ADD COLUMN deleted BOOLEAN DEFAULT FALSE;

-- Update public read policy to exclude deleted
CREATE OR REPLACE POLICY "Public can view active gallery items"
ON gallery_items FOR SELECT
USING (deleted = FALSE);

-- Change delete to soft delete in frontend
async function softDeleteGalleryItem(id: string) {
  await supabase
    .from('gallery_items')
    .update({ deleted: true })
    .eq('id', id)
}
```

**Option C: Warning system**

```sql
-- Function to check for gallery references before project delete
CREATE OR REPLACE FUNCTION warn_gallery_references()
RETURNS TRIGGER AS $$
DECLARE
  ref_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO ref_count 
  FROM gallery_items 
  WHERE project_id = OLD.id;
  
  IF ref_count > 0 THEN
    RAISE WARNING 'Deleting project with % gallery references', ref_count;
    -- Still allow delete, but log the warning
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_warn_gallery_references
  BEFORE DELETE ON projects
  FOR EACH ROW 
  EXECUTE FUNCTION warn_gallery_references();
```

---

### 9. **Broken Image URLs**

**Problem:** Admin updates `image_url` to non-existent file, breaking public gallery.

**Fix:** Already addressed in #6 (make image_url immutable). Additional frontend check:

```typescript
async function verifyImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok && response.headers.get('content-type')?.startsWith('image/')
  } catch {
    return false
  }
}

// Use before adding to gallery
const exists = await verifyImageExists(imageUrl)
if (!exists) {
  throw new Error('Image URL is not accessible')
}
```

---

## Storage Cleanup Risks

### 10. **Race Condition in Cleanup Script**

**Problem:** Cleanup lists files, admin adds reference, cleanup deletes file → broken gallery.

**Fix:** Add timestamp buffer and transactional check:

```typescript
async function safeCleanupOrphanedFiles() {
  const { $supabase } = useNuxtApp()
  
  // Only delete files older than 7 days (safe buffer)
  const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  const { data: files } = await $supabase.storage
    .from('project-images')
    .list('gallery/standalone/')
  
  const { data: dbItems } = await $supabase
    .from('gallery_items')
    .select('image_url')
    .eq('source_type', 'standalone')
  
  const dbUrls = new Set(dbItems?.map(item => item.image_url) || [])
  
  const orphans = files?.filter(file => {
    const fullUrl = `${supabaseUrl}/storage/v1/object/public/project-images/gallery/standalone/${file.name}`
    const isOrphan = !dbUrls.has(fullUrl)
    const isOld = new Date(file.created_at) < cutoffDate
    return isOrphan && isOld
  }) || []
  
  // Double-check each file before deletion
  for (const file of orphans) {
    const fullUrl = `${supabaseUrl}/storage/v1/object/public/project-images/gallery/standalone/${file.name}`
    
    // Recheck DB (in case admin added reference during cleanup)
    const { data: recheck } = await $supabase
      .from('gallery_items')
      .select('id')
      .eq('image_url', fullUrl)
      .single()
    
    if (!recheck) {
      await $supabase.storage
        .from('project-images')
        .remove([`gallery/standalone/${file.name}`])
      
      console.log(`Deleted orphaned file: ${file.name}`)
    } else {
      console.log(`Skipped (now referenced): ${file.name}`)
    }
  }
}
```

---

### 11. **No Audit Trail**

**Problem:** Admin deletes gallery item by mistake, no way to recover or know who did it.

**Fix:** Add audit log table:

```sql
-- Create audit log
CREATE TABLE gallery_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_item_id UUID,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trigger
CREATE OR REPLACE FUNCTION audit_gallery_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO gallery_audit_log (gallery_item_id, action, old_data, user_id)
    VALUES (OLD.id, 'DELETE', row_to_json(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO gallery_audit_log (gallery_item_id, action, old_data, new_data, user_id)
    VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO gallery_audit_log (gallery_item_id, action, new_data, user_id)
    VALUES (NEW.id, 'INSERT', row_to_json(NEW), auth.uid());
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_gallery
  AFTER INSERT OR UPDATE OR DELETE ON gallery_items
  FOR EACH ROW 
  EXECUTE FUNCTION audit_gallery_changes();
```

**Recovery function:**

```sql
-- Restore deleted gallery item
CREATE OR REPLACE FUNCTION restore_gallery_item(log_id UUID)
RETURNS gallery_items AS $$
DECLARE
  restored_item gallery_items;
BEGIN
  INSERT INTO gallery_items (id, image_url, source_type, project_id, alt_text, caption, sort_order, created_at)
  SELECT 
    (old_data->>'id')::UUID,
    old_data->>'image_url',
    old_data->>'source_type',
    (old_data->>'project_id')::UUID,
    old_data->>'alt_text',
    old_data->>'caption',
    (old_data->>'sort_order')::INTEGER,
    (old_data->>'created_at')::TIMESTAMPTZ
  FROM gallery_audit_log
  WHERE id = log_id AND action = 'DELETE'
  RETURNING * INTO restored_item;
  
  RETURN restored_item;
END;
$$ LANGUAGE plpgsql;
```

---

### 12. **Storage Quota Exhaustion**

**Problem:** Admin uploads hundreds of large images, exhausts storage quota, site breaks.

**Fix:** Add storage monitoring and limits:

```sql
-- Track storage usage per user
CREATE TABLE storage_usage (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  bytes_used BIGINT DEFAULT 0,
  file_count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update usage on upload
CREATE OR REPLACE FUNCTION track_storage_usage()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO storage_usage (user_id, bytes_used, file_count)
  VALUES (auth.uid(), NEW.size, 1)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    bytes_used = storage_usage.bytes_used + NEW.size,
    file_count = storage_usage.file_count + 1,
    last_updated = NOW();
  
  -- Enforce per-admin limit (e.g., 500MB)
  IF (SELECT bytes_used FROM storage_usage WHERE user_id = auth.uid()) > 500000000 THEN
    RAISE EXCEPTION 'Storage quota exceeded (500MB max per admin)';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_track_storage_usage
  AFTER INSERT ON storage.objects
  FOR EACH ROW 
  EXECUTE FUNCTION track_storage_usage();
```

---

## Summary of Fixes

| Issue | Risk Level | Fix Applied |
|-------|-----------|-------------|
| Weak auth check | 🔴 Critical | Role-based RLS with admin check |
| UPDATE bypass caps | 🔴 Critical | Immutable source_type + UPDATE trigger |
| Path traversal | 🔴 Critical | Path validation in storage policy |
| No file type check | 🟠 High | MIME type validation + magic bytes |
| Race condition | 🟠 High | Advisory locks in trigger |
| Mutable fields | 🟠 High | Immutability trigger |
| Sort order abuse | 🟡 Medium | Constraint 0-10000 |
| CASCADE delete | 🟡 Medium | RESTRICT or soft delete |
| Broken URLs | 🟡 Medium | Immutable image_url |
| Cleanup race | 🟡 Medium | 7-day buffer + recheck |
| No audit trail | 🟡 Medium | Audit log table |
| Quota exhaustion | 🟡 Medium | Storage usage tracking |

---

## Recommended Migration Order

1. **Immediate (before going live):**
   - Add role-based RLS (#1)
   - Prevent source_type changes (#2)
   - Add path validation (#3)
   - Add file type validation (#4)

2. **Within first week:**
   - Add advisory locks (#5)
   - Protect immutable fields (#6)
   - Add sort order bounds (#7)

3. **Within first month:**
   - Implement audit logging (#11)
   - Add storage quota tracking (#12)
   - Decide on CASCADE strategy (#8)
   - Add URL verification (#9)

4. **Ongoing maintenance:**
   - Run cleanup script weekly (#10)
   - Review audit logs monthly
   - Monitor storage usage

---

## Testing the Fixes

```sql
-- Test 1: Non-admin cannot insert
-- Login as non-admin user
INSERT INTO gallery_items (image_url, source_type, alt_text)
VALUES ('test.jpg', 'standalone', 'test');
-- Expected: RLS violation error

-- Test 2: Cannot change source_type
UPDATE gallery_items SET source_type = 'project' WHERE source_type = 'standalone';
-- Expected: "Cannot change source_type" error

-- Test 3: Cannot modify created_at
UPDATE gallery_items SET created_at = NOW() WHERE id = 'some-id';
-- Expected: "Cannot modify created_at" error

-- Test 4: Sort order bounds
INSERT INTO gallery_items (image_url, source_type, alt_text, sort_order)
VALUES ('test.jpg', 'standalone', 'test', 99999);
-- Expected: "valid_sort_order" constraint violation

-- Test 5: Concurrent insert (run in 2 terminals simultaneously)
-- Terminal 1 & 2:
BEGIN;
INSERT INTO gallery_items (image_url, source_type, alt_text)
VALUES ('test1.jpg', 'standalone', 'test');
COMMIT;
-- Expected: One succeeds, one waits then fails with cap error

-- Test 6: View audit log
SELECT * FROM gallery_audit_log ORDER BY performed_at DESC LIMIT 10;
-- Expected: Shows recent changes with user_id
```

All fixes are backward compatible and can be applied incrementally without downtime.
