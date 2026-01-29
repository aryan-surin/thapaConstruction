# Gallery Feature - Minimal Supabase Extension

## Overview
This guide extends your existing Supabase setup to support a curated gallery feature. It assumes you already have:
- Working Supabase client in Nuxt
- `projects` table with `id` column (UUID)
- `project-images` storage bucket
- Admin authentication and RLS policies

---

## 1. DATABASE - New Table Only

### Create `gallery_items` Table

Run this SQL in Supabase SQL Editor:

```sql
-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('project', 'standalone')),
  project_id UUID NULL,
  alt_text TEXT NOT NULL,
  caption TEXT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0 AND sort_order <= 10000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure project_id is only set for project source_type
  CONSTRAINT gallery_items_project_fk_check CHECK (
    (source_type = 'project' AND project_id IS NOT NULL)
    OR (source_type = 'standalone' AND project_id IS NULL)
  ),
  
  -- Foreign key to existing projects table
  CONSTRAINT fk_gallery_project
    FOREIGN KEY (project_id) 
    REFERENCES projects(id) 
    ON DELETE CASCADE
);

-- Prevent duplicate images
CREATE UNIQUE INDEX ux_gallery_source_image
  ON gallery_items (source_type, image_url);

-- Fast ordering queries
CREATE INDEX idx_gallery_sort_created
  ON gallery_items (sort_order ASC, created_at ASC);

-- Filter by source type
CREATE INDEX idx_gallery_source_type
  ON gallery_items (source_type);

-- Filter by project
CREATE INDEX idx_gallery_project
  ON gallery_items (project_id)
  WHERE project_id IS NOT NULL;

COMMENT ON TABLE gallery_items IS 'Curated gallery: max 30 total, max 5 standalone';
```

**Foreign Key Behavior:**
- `ON DELETE CASCADE`: If you delete a project, all its gallery references are removed automatically
- **Alternative**: Use `ON DELETE RESTRICT` to prevent project deletion if gallery references exist:
  ```sql
  CONSTRAINT fk_gallery_project
    FOREIGN KEY (project_id) 
    REFERENCES projects(id) 
    ON DELETE RESTRICT
  ```

---

### Enforce Caps with Triggers

```sql
-- Function to enforce 30 total / 5 standalone caps
CREATE OR REPLACE FUNCTION enforce_gallery_caps()
RETURNS TRIGGER AS $$
DECLARE
  total_count INTEGER;
  standalone_count INTEGER;
BEGIN
  -- Acquire lock to prevent race conditions
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

-- Attach trigger
CREATE TRIGGER trg_enforce_gallery_caps
  BEFORE INSERT ON gallery_items
  FOR EACH ROW 
  EXECUTE FUNCTION enforce_gallery_caps();
```

---

### Protect Immutable Fields

```sql
-- Prevent changes to critical fields after insert
CREATE OR REPLACE FUNCTION protect_gallery_immutable_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.source_type != NEW.source_type THEN
    RAISE EXCEPTION 'Cannot change source_type after insert';
  END IF;
  
  IF OLD.created_at != NEW.created_at THEN
    RAISE EXCEPTION 'Cannot modify created_at timestamp';
  END IF;
  
  IF OLD.image_url != NEW.image_url THEN
    RAISE EXCEPTION 'Cannot modify image_url. Delete and re-add instead.';
  END IF;
  
  IF OLD.source_type = 'project' AND OLD.project_id != NEW.project_id THEN
    RAISE EXCEPTION 'Cannot modify project_id for project-sourced images';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_gallery_immutable
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW 
  EXECUTE FUNCTION protect_gallery_immutable_fields();
```

**What can be updated:** Only `alt_text`, `caption`, and `sort_order`.

---

## 2. ROW LEVEL SECURITY (RLS)

### Enable RLS and Create Policies

```sql
-- Enable RLS on new table
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can read gallery items
CREATE POLICY "Public read gallery"
ON gallery_items FOR SELECT
USING (true);

-- Policy 2: Only authenticated admins can insert
-- (Adjust based on your existing admin check)
CREATE POLICY "Admin insert gallery"
ON gallery_items FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  -- If you use role metadata: AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Policy 3: Only authenticated admins can update
CREATE POLICY "Admin update gallery"
ON gallery_items FOR UPDATE
USING (
  auth.role() = 'authenticated'
  -- If you use role metadata: AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Policy 4: Only authenticated admins can delete
CREATE POLICY "Admin delete gallery"
ON gallery_items FOR DELETE
USING (
  auth.role() = 'authenticated'
  -- If you use role metadata: AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
```

**Integration Note:** Replace `auth.role() = 'authenticated'` with your existing admin check pattern if you use custom role validation.

---

## 3. STORAGE - Reuse Existing Bucket

### Folder Structure

Your existing `project-images` bucket structure:
```
project-images/
├── projects/
│   ├── {project-uuid-1}/
│   │   ├── hero.jpg
│   │   └── gallery-1.jpg
│   └── {project-uuid-2}/
│       └── cover.jpg
└── gallery/              ← NEW
    └── standalone/       ← NEW (max 5 images)
        ├── img-1.jpg
        └── img-2.jpg
```

### Storage Policy Updates (If Needed)

Check if your existing storage policies already allow admin uploads to any path under `project-images`. If not, update:

```sql
-- Check existing policies first
SELECT * FROM storage.policies WHERE bucket_id = 'project-images';

-- If needed, add gallery path to existing upload policy
-- Example (adjust based on your current policy):
CREATE POLICY "Admin upload to project-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
  AND (
    name LIKE 'projects/%' 
    OR name LIKE 'gallery/standalone/%'  -- ADD THIS LINE
  )
);
```

**Most likely:** Your existing policies already allow admin uploads anywhere in `project-images`, so no changes needed.

---

## 4. FRONTEND INTEGRATION

### Using Your Existing Supabase Client

Your existing `plugins/supabase.client.ts` exports `$supabase`. Use it directly:

```typescript
const { $supabase } = useNuxtApp()
```

---

### Add Project Image Reference to Gallery

```typescript
/**
 * Add existing project image to gallery (no upload)
 */
async function addProjectImageToGallery(
  imageUrl: string,    // Existing project image URL
  projectId: string,   // UUID from projects table
  altText: string,
  caption?: string,
  sortOrder: number = 0
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { $supabase } = useNuxtApp()
    
    const { data, error } = await $supabase
      .from('gallery_items')
      .insert({
        image_url: imageUrl,
        source_type: 'project',
        project_id: projectId,
        alt_text: altText,
        caption: caption || null,
        sort_order: sortOrder
      })
      .select()
      .single()
    
    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'This image is already in the gallery' }
      }
      if (error.message.includes('cap reached')) {
        return { success: false, error: 'Gallery is full (30 items max)' }
      }
      throw error
    }
    
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to add to gallery' }
  }
}
```

---

### Upload Standalone Image

```typescript
/**
 * Upload standalone gallery image with compression
 */
async function uploadStandaloneGalleryImage(
  file: File,
  altText: string,
  caption?: string,
  sortOrder: number = 0
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { $supabase } = useNuxtApp()
    
    // 1. Compress image (optional but recommended)
    const compressedFile = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.85
    })
    
    // 2. Generate unique filename
    const fileExt = file.name.split('.').pop()
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const storagePath = `gallery/standalone/${uniqueName}`
    
    // 3. Upload to storage
    const { error: uploadError } = await $supabase.storage
      .from('project-images')
      .upload(storagePath, compressedFile, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) throw uploadError
    
    // 4. Get public URL
    const { data: urlData } = $supabase.storage
      .from('project-images')
      .getPublicUrl(storagePath)
    
    const publicUrl = urlData?.publicUrl
    if (!publicUrl) throw new Error('Failed to get public URL')
    
    // 5. Insert DB record
    const { data: dbData, error: dbError } = await $supabase
      .from('gallery_items')
      .insert({
        image_url: publicUrl,
        source_type: 'standalone',
        project_id: null,
        alt_text: altText,
        caption: caption || null,
        sort_order: sortOrder
      })
      .select()
      .single()
    
    if (dbError) {
      // Rollback: Delete uploaded file
      await $supabase.storage
        .from('project-images')
        .remove([storagePath])
      throw dbError
    }
    
    return { success: true, data: dbData }
    
  } catch (err: any) {
    return { success: false, error: err.message || 'Upload failed' }
  }
}

/**
 * Simple image compression using Canvas API
 */
async function compressImage(
  file: File,
  options: { maxWidth: number; maxHeight: number; quality: number }
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        
        if (width > options.maxWidth || height > options.maxHeight) {
          const ratio = Math.min(
            options.maxWidth / width,
            options.maxHeight / height
          )
          width *= ratio
          height *= ratio
        }
        
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Compression failed'))
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }))
          },
          'image/jpeg',
          options.quality
        )
      }
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsDataURL(file)
  })
}
```

---

### Delete Gallery Item Safely

```typescript
/**
 * Smart deletion:
 * - Standalone: Delete DB row + storage file
 * - Project: Delete only DB reference (keep project image)
 */
async function deleteGalleryItem(
  item: {
    id: string
    image_url: string
    source_type: 'project' | 'standalone'
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { $supabase } = useNuxtApp()
    
    // 1. Delete DB row
    const { error: dbError } = await $supabase
      .from('gallery_items')
      .delete()
      .eq('id', item.id)
    
    if (dbError) throw dbError
    
    // 2. Delete storage file ONLY if standalone
    if (item.source_type === 'standalone') {
      const urlParts = item.image_url.split('/project-images/')
      if (urlParts.length === 2) {
        const storagePath = urlParts[1]
        const { error: storageError } = await $supabase.storage
          .from('project-images')
          .remove([storagePath])
        
        if (storageError) {
          console.warn('Storage delete failed (non-critical):', storageError)
        }
      }
    }
    // If project-based, storage file is NOT deleted (still used by project)
    
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Delete failed' }
  }
}
```

---

### Fetch Gallery Items

```typescript
/**
 * Fetch all gallery items for public display
 */
async function fetchGalleryItems(): Promise<{
  success: boolean
  data?: any[]
  error?: string
}> {
  try {
    const { $supabase } = useNuxtApp()
    
    const { data, error } = await $supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return { success: true, data: data || [] }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
```

---

## 5. INTEGRATION WITH EXISTING SYSTEM

### What Happens When a Project is Deleted?

**With CASCADE (recommended for curated galleries):**
```sql
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
```
- Project deleted → All its gallery references automatically removed
- Gallery items don't prevent project deletion
- Suitable for curated galleries where references can be re-added

**With RESTRICT (if gallery is permanent):**
```sql
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT
```
- Project deletion blocked if gallery references exist
- Admin must remove from gallery first, then delete project
- Suitable if gallery is a "featured projects" list

**Your choice:** Already set to CASCADE in the SQL above. Change if needed.

---

### Required Cleanup

**Orphaned Files:**
If storage delete fails after DB delete, you'll have orphaned files in `gallery/standalone/`.

**Cleanup script (run monthly):**
```typescript
async function cleanupOrphanedGalleryFiles() {
  const { $supabase } = useNuxtApp()
  
  // List all files in gallery/standalone/
  const { data: files } = await $supabase.storage
    .from('project-images')
    .list('gallery/standalone/')
  
  // Fetch all standalone gallery items from DB
  const { data: dbItems } = await $supabase
    .from('gallery_items')
    .select('image_url')
    .eq('source_type', 'standalone')
  
  const dbUrls = new Set(dbItems?.map(i => i.image_url) || [])
  
  // Delete files not in DB (older than 7 days for safety)
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
  const toDelete = files?.filter(file => {
    const fullUrl = `...storage/v1/object/public/project-images/gallery/standalone/${file.name}`
    const isOrphan = !dbUrls.has(fullUrl)
    const isOld = new Date(file.created_at).getTime() < cutoff
    return isOrphan && isOld
  }) || []
  
  if (toDelete.length > 0) {
    await $supabase.storage
      .from('project-images')
      .remove(toDelete.map(f => `gallery/standalone/${f.name}`))
    console.log(`Cleaned up ${toDelete.length} orphaned files`)
  }
}
```

---

### What NOT to Touch

**Leave these unchanged:**
- ✅ `projects` table structure
- ✅ Existing project image storage paths (`projects/*`)
- ✅ Existing RLS policies on `projects` table
- ✅ Existing authentication logic
- ✅ Existing admin middleware
- ✅ Existing storage bucket settings

**Only add:**
- ✅ New `gallery_items` table
- ✅ New RLS policies for `gallery_items` only
- ✅ New folder path `gallery/standalone/` (no bucket changes)

---

## 6. DATA FLOW SUMMARY

### Admin Adds Project Image to Gallery
```
Existing project image URL → Insert into gallery_items with:
  - source_type = 'project'
  - project_id = UUID
  - No storage upload
→ Appears in public gallery
```

### Admin Uploads Standalone Image
```
New image file → Compress → Upload to gallery/standalone/ 
→ Get public URL → Insert into gallery_items with:
  - source_type = 'standalone'
  - project_id = NULL
→ Appears in public gallery
```

### Admin Deletes Gallery Item
```
Delete DB row from gallery_items
→ If source_type = 'standalone': Also delete storage file
→ If source_type = 'project': Keep storage file (still used by project)
```

### Project is Deleted (CASCADE)
```
Project deleted → Supabase CASCADE automatically removes all:
  - gallery_items rows where project_id = deleted project
→ Storage files in projects/{id}/ can be cleaned up separately
```

---

## 7. MIGRATION CHECKLIST

Run in this order:

1. **[x] Create `gallery_items` table** (SQL above)
2. **[x] Create cap enforcement trigger** (SQL above)
3. **[x] Create immutability trigger** (SQL above)
4. **[x] Enable RLS on `gallery_items`** (SQL above)
5. **[x] Create RLS policies** (SQL above)
6. **[x] Verify storage policies allow `gallery/standalone/`** (check existing policies)
7. **[x] Test insert project reference** (should work immediately)
8. **[x] Test upload standalone image** (should create `gallery/standalone/` folder)
9. **[x] Test delete standalone** (verify file removed)
10. **[x] Test delete project reference** (verify file NOT removed)

---

## 8. TESTING QUERIES

Run these in Supabase SQL Editor to verify:

```sql
-- Test 1: Insert project reference (replace UUIDs)
INSERT INTO gallery_items (image_url, source_type, project_id, alt_text, sort_order)
VALUES (
  'https://...project-images/projects/abc-123/hero.jpg',
  'project',
  'abc-123-uuid-of-existing-project',
  'Modern kitchen design',
  10
);
-- Expected: Success

-- Test 2: Try to insert 31st item
-- (After inserting 30 items)
INSERT INTO gallery_items (image_url, source_type, alt_text)
VALUES ('https://test.jpg', 'standalone', 'test');
-- Expected: Error "Gallery cap reached"

-- Test 3: Try to update source_type
UPDATE gallery_items SET source_type = 'standalone' WHERE source_type = 'project';
-- Expected: Error "Cannot change source_type"

-- Test 4: View current gallery
SELECT 
  id, 
  source_type, 
  alt_text, 
  sort_order,
  CASE 
    WHEN project_id IS NOT NULL THEN 'From project ' || project_id
    ELSE 'Standalone'
  END as source
FROM gallery_items
ORDER BY sort_order, created_at;

-- Test 5: Check if project deletion cascades
DELETE FROM projects WHERE id = 'some-test-project-uuid';
-- Then check gallery_items - should have removed references automatically
```

---

## Summary

**Added:**
- 1 new table: `gallery_items`
- 2 triggers: cap enforcement + immutability
- 4 RLS policies: read (public), insert/update/delete (admin)
- 1 new storage folder: `gallery/standalone/`

**Not touched:**
- Existing `projects` table
- Existing storage structure
- Existing auth/RLS
- Existing admin logic

**Integration:**
- Foreign key CASCADE removes gallery items when project deleted
- Standalone images isolated in `gallery/standalone/`
- All operations use existing Supabase client (`$supabase`)

You're ready to use the gallery feature. Deploy frontend code that uses the functions above.
