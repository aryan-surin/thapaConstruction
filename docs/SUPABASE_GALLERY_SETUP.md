# Complete Supabase Gallery Setup Guide

## Overview
This guide walks through setting up a curated gallery system with Supabase backend and Nuxt/Vue frontend. The gallery supports project-based image references and standalone uploads with enforced limits.

---

## PART 1: SUPABASE PROJECT SETUP

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `thapa-construction` (or your choice)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose closest to your users (e.g., `ap-south-1` for India)
4. Click **"Create new project"** and wait 2-3 minutes for provisioning

### Step 2: Get API Credentials

1. In your Supabase dashboard, click **"Settings"** (gear icon) → **"API"**
2. Copy the following values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long JWT token)
   - **service_role key**: `eyJhbGc...` (DO NOT expose client-side)

3. Add to your Nuxt `.env` file:
```env
NUXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGc... (anon public key)
```

### Step 3: Enable Authentication

1. Go to **"Authentication"** → **"Providers"**
2. Enable **Email** provider (default enabled)
3. Go to **"Authentication"** → **"Users"**
4. Click **"Add user"** → **"Create new user"**
5. Enter admin email and password (e.g., `admin@thapaconstruction.com`)
6. Confirm the user (check "Auto Confirm User" if testing locally)

---

## PART 2: DATABASE SETUP

### Step 1: Create `gallery_items` Table

1. Go to **"SQL Editor"** in Supabase dashboard
2. Click **"New Query"**
3. Paste and execute:

```sql
-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('project', 'standalone')),
  project_id UUID NULL,
  alt_text TEXT NOT NULL,
  caption TEXT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure project_id is only set for project source_type
  CONSTRAINT gallery_items_project_fk_check CHECK (
    (source_type = 'project' AND project_id IS NOT NULL)
    OR (source_type = 'standalone' AND project_id IS NULL)
  )
);

-- Create unique index to prevent duplicate images
CREATE UNIQUE INDEX IF NOT EXISTS ux_gallery_source_image
  ON gallery_items (source_type, image_url);

-- Create index for fast sorted queries
CREATE INDEX IF NOT EXISTS idx_gallery_sort_created
  ON gallery_items (sort_order ASC, created_at ASC);

-- Create index for source type filtering
CREATE INDEX IF NOT EXISTS idx_gallery_source_type
  ON gallery_items (source_type);

-- Create index for project references
CREATE INDEX IF NOT EXISTS idx_gallery_project
  ON gallery_items (project_id)
  WHERE project_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON TABLE gallery_items IS 'Curated gallery with max 30 items total, max 5 standalone';
```

### Step 2: Create Enforcement Trigger for Caps

```sql
-- Function to enforce gallery caps
CREATE OR REPLACE FUNCTION enforce_gallery_caps()
RETURNS TRIGGER AS $$
DECLARE
  total_count INTEGER;
  standalone_count INTEGER;
BEGIN
  -- Count current total items (excluding the row being inserted)
  SELECT COUNT(*) INTO total_count FROM gallery_items;
  
  IF total_count >= 30 THEN
    RAISE EXCEPTION 'Gallery cap reached: maximum 30 items allowed';
  END IF;

  -- Check standalone cap if inserting standalone type
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

-- Attach trigger to gallery_items table
DROP TRIGGER IF EXISTS trg_enforce_gallery_caps ON gallery_items;
CREATE TRIGGER trg_enforce_gallery_caps
  BEFORE INSERT ON gallery_items
  FOR EACH ROW 
  EXECUTE FUNCTION enforce_gallery_caps();
```

**Why a trigger?**
- Enforces limits at the database level, preventing bypass via direct SQL or API
- Atomic enforcement (no race conditions)
- Frontend can mirror these checks for better UX, but backend is source of truth

### Step 3: Optional - Foreign Key to Projects Table

If you have a `projects` table, enforce referential integrity:

```sql
-- Only run if you have a projects table with id column
ALTER TABLE gallery_items 
  ADD CONSTRAINT fk_gallery_project
  FOREIGN KEY (project_id) 
  REFERENCES projects(id) 
  ON DELETE CASCADE;
```

**Cascade behavior**: If a project is deleted, all its gallery references are removed automatically.

---

## PART 3: STORAGE SETUP

### Step 1: Create Storage Bucket

1. Go to **"Storage"** in Supabase dashboard
2. Click **"Create a new bucket"**
3. Enter:
   - **Name**: `project-images`
   - **Public bucket**: Check this (enables public read access)
   - **File size limit**: Set to `5 MB` (adjust as needed)
   - **Allowed MIME types**: Leave empty or specify `image/jpeg,image/png,image/webp`
4. Click **"Create bucket"**

### Step 2: Create Folder Structure

Storage folders are created automatically on first upload, but for clarity:

**Structure:**
```
project-images/
├── projects/
│   ├── {project-uuid-1}/
│   │   ├── hero.jpg
│   │   ├── gallery-1.jpg
│   │   └── gallery-2.jpg
│   └── {project-uuid-2}/
│       └── cover.jpg
└── gallery/
    └── standalone/
        ├── featured-1.jpg
        ├── featured-2.jpg
        └── ...max 5 total
```

### Step 3: Configure Storage Policies

Go to **"Storage"** → **"project-images"** → **"Policies"**

#### Policy 1: Public Read Access

```sql
-- Allow anyone to read (download) images
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');
```

#### Policy 2: Admin Upload

```sql
-- Only authenticated users can upload
CREATE POLICY "Admin upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Admin Delete

```sql
-- Only authenticated users can delete
CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 4: Admin Update (Optional)

```sql
-- Only authenticated users can update/overwrite
CREATE POLICY "Admin update access"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);
```

**Security Note**: `auth.role() = 'authenticated'` means any logged-in user can upload. For production, add role-based checks:

```sql
-- Example: Check for admin role in user metadata
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
```

---

## PART 4: ROW LEVEL SECURITY (RLS)

### Step 1: Enable RLS on `gallery_items`

```sql
-- Enable Row Level Security
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
```

### Step 2: Create RLS Policies

#### Policy 1: Public Read

```sql
-- Anyone can read gallery items (public facing)
CREATE POLICY "Public can view gallery items"
ON gallery_items FOR SELECT
USING (true);
```

#### Policy 2: Admin Insert

```sql
-- Only authenticated admins can insert
CREATE POLICY "Admin can insert gallery items"
ON gallery_items FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

#### Policy 3: Admin Update

```sql
-- Only authenticated admins can update
CREATE POLICY "Admin can update gallery items"
ON gallery_items FOR UPDATE
USING (auth.role() = 'authenticated');
```

#### Policy 4: Admin Delete

```sql
-- Only authenticated admins can delete
CREATE POLICY "Admin can delete gallery items"
ON gallery_items FOR DELETE
USING (auth.role() = 'authenticated');
```

### Step 3: Verify RLS is Working

Test in SQL Editor:

```sql
-- As anonymous user (should work)
SELECT * FROM gallery_items;

-- As anonymous user (should fail)
INSERT INTO gallery_items (image_url, source_type, alt_text)
VALUES ('test.jpg', 'standalone', 'test');
-- Error: new row violates row-level security policy
```

---

## PART 5: FRONTEND INTEGRATION

### Setup: Supabase Client Plugin

Your existing `plugins/supabase.client.ts` should look like:

```typescript
import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  )
  
  return {
    provide: {
      supabase
    }
  }
})
```

### Frontend Function Examples

#### 1. Upload Standalone Image with Compression

```typescript
/**
 * Upload a standalone gallery image with client-side compression
 * 
 * @param file - Raw file from input[type="file"]
 * @param altText - Required alt text for accessibility
 * @param caption - Optional caption
 * @param sortOrder - Display order (default 0)
 * @returns Upload result with public URL or error
 */
async function uploadStandaloneGalleryImage(
  file: File,
  altText: string,
  caption?: string,
  sortOrder: number = 0
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { $supabase } = useNuxtApp()
    
    // Step 1: Compress image on frontend (optional but recommended)
    const compressedFile = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.85
    })
    
    // Step 2: Generate unique filename
    const fileExt = file.name.split('.').pop()
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
    const storagePath = `gallery/standalone/${uniqueName}`
    
    // Step 3: Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await $supabase.storage
      .from('project-images')
      .upload(storagePath, compressedFile, {
        cacheControl: '3600',
        upsert: false // Prevent overwriting
      })
    
    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`)
    }
    
    // Step 4: Get public URL
    const { data: urlData } = $supabase.storage
      .from('project-images')
      .getPublicUrl(storagePath)
    
    const publicUrl = urlData?.publicUrl
    if (!publicUrl) {
      throw new Error('Failed to generate public URL')
    }
    
    // Step 5: Insert DB record
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
      // Rollback: Delete uploaded file if DB insert fails
      await $supabase.storage
        .from('project-images')
        .remove([storagePath])
      
      throw new Error(`Database insert failed: ${dbError.message}`)
    }
    
    return { success: true, data: dbData }
    
  } catch (err: any) {
    console.error('Upload standalone image error:', err)
    return { success: false, error: err.message || 'Upload failed' }
  }
}

/**
 * Simple image compression utility using Canvas API
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
        
        // Maintain aspect ratio
        if (width > options.maxWidth || height > options.maxHeight) {
          const ratio = Math.min(
            options.maxWidth / width,
            options.maxHeight / height
          )
          width = width * ratio
          height = height * ratio
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'))
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
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

#### 2. Add Project Image Reference

```typescript
/**
 * Add an existing project image to gallery (no upload, just DB reference)
 * 
 * @param imageUrl - Full public URL of existing project image
 * @param projectId - UUID of the source project
 * @param altText - Required alt text
 * @param caption - Optional caption
 * @param sortOrder - Display order
 */
async function addProjectImageToGallery(
  imageUrl: string,
  projectId: string,
  altText: string,
  caption?: string,
  sortOrder: number = 0
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { $supabase } = useNuxtApp()
    
    // Insert DB reference only (image already exists in storage)
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
      // Check for duplicate constraint violation
      if (error.code === '23505') {
        throw new Error('This project image is already in the gallery')
      }
      throw error
    }
    
    return { success: true, data }
    
  } catch (err: any) {
    console.error('Add project image error:', err)
    return { success: false, error: err.message || 'Failed to add project image' }
  }
}
```

#### 3. Delete Gallery Item (Smart Deletion)

```typescript
/**
 * Delete a gallery item with smart cleanup
 * 
 * - Standalone: Delete both DB row AND storage file
 * - Project: Delete only DB reference (preserve project image)
 * 
 * @param galleryItem - The gallery item to delete
 */
async function deleteGalleryItem(
  galleryItem: {
    id: string
    image_url: string
    source_type: 'project' | 'standalone'
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { $supabase } = useNuxtApp()
    
    // Step 1: Delete DB row first (safer order)
    const { error: dbError } = await $supabase
      .from('gallery_items')
      .delete()
      .eq('id', galleryItem.id)
    
    if (dbError) {
      throw new Error(`DB delete failed: ${dbError.message}`)
    }
    
    // Step 2: Delete storage file ONLY if standalone
    if (galleryItem.source_type === 'standalone') {
      // Extract storage path from URL
      const urlParts = galleryItem.image_url.split('/project-images/')
      if (urlParts.length < 2) {
        console.warn('Could not parse storage path, skipping file deletion')
        return { success: true } // DB row is deleted, that's the critical part
      }
      
      const storagePath = urlParts[1]
      
      const { error: storageError } = await $supabase.storage
        .from('project-images')
        .remove([storagePath])
      
      if (storageError) {
        console.error('Storage delete failed (non-critical):', storageError)
        // Don't fail the whole operation - DB row is already deleted
        // Orphaned files can be cleaned up manually or via cron job
      }
    }
    // If source_type === 'project', skip storage deletion (image still used by project)
    
    return { success: true }
    
  } catch (err: any) {
    console.error('Delete gallery item error:', err)
    return { success: false, error: err.message || 'Delete failed' }
  }
}
```

#### 4. Fetch Gallery Items (Public)

```typescript
/**
 * Fetch all gallery items for public display
 * Ordered by sort_order ASC, then created_at ASC
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
    console.error('Fetch gallery error:', err)
    return { success: false, error: err.message || 'Fetch failed' }
  }
}
```

---

## PART 6: ERROR HANDLING & ROLLBACK STRATEGIES

### Scenario 1: Upload Succeeds, DB Insert Fails

**Problem**: Image is in storage, but no DB record exists (orphaned file).

**Solution**: Delete uploaded file in catch block (shown in upload example above).

```typescript
try {
  // Upload
  const { data: uploadData } = await supabase.storage.upload(path, file)
  
  // Insert DB
  const { error: dbError } = await supabase.from('gallery_items').insert(...)
  if (dbError) {
    // ROLLBACK: Delete uploaded file
    await supabase.storage.from('project-images').remove([path])
    throw dbError
  }
} catch (err) {
  // Handle error
}
```

**Why delete storage first?** File cleanup is easier than rolling back DB transactions.

### Scenario 2: DB Delete Succeeds, Storage Delete Fails

**Problem**: DB record is gone, but storage file remains (orphaned file).

**Solution**: Log the error but don't fail the operation. DB is source of truth.

```typescript
// Delete DB first
await supabase.from('gallery_items').delete().eq('id', id)

// Try to delete storage (best effort)
const { error: storageError } = await supabase.storage.remove([path])
if (storageError) {
  console.error('Storage cleanup failed:', storageError)
  // Send to monitoring/alerting system
  // Schedule cleanup job for later
}
```

**Cleanup strategy**:
- Run periodic script to find orphaned files (files in storage not in DB)
- Compare storage bucket contents with `gallery_items.image_url`
- Delete unmatched files older than X days

### Scenario 3: Cap Limit Reached Mid-Upload

**Problem**: User uploads image, but cap is reached by another admin between upload and insert.

**Solution**: Trigger will reject insert, catch block will delete uploaded file.

```typescript
try {
  const { data: uploadData } = await upload(...)
  const { error: dbError } = await insert(...)
  
  if (dbError) {
    if (dbError.message.includes('cap reached')) {
      // Rollback upload
      await supabase.storage.remove([path])
      throw new Error('Gallery is full (30 items max)')
    }
  }
} catch (err) {
  // Show user-friendly error
}
```

### Scenario 4: Network Failure During Upload

**Problem**: Upload starts but network drops before completion.

**Solution**: Supabase client handles this automatically with timeouts. Frontend should:

```typescript
try {
  const { data, error } = await supabase.storage.upload(path, file, {
    // Add timeout
    abortSignal: AbortSignal.timeout(30000) // 30 seconds
  })
} catch (err) {
  if (err.name === 'AbortError') {
    return { success: false, error: 'Upload timeout. Please try again.' }
  }
}
```

---

## PART 7: DATA FLOW DIAGRAM

### Admin Adds Standalone Image

```
┌─────────────┐
│ Admin UI    │
│ File Input  │
└──────┬──────┘
       │ 1. User selects image
       ▼
┌─────────────┐
│ Compression │
│ (Frontend)  │
└──────┬──────┘
       │ 2. Compress to max 1920px @ 85% quality
       ▼
┌─────────────┐
│ Supabase    │
│ Storage     │
│ Upload      │
└──────┬──────┘
       │ 3. Upload to gallery/standalone/{uuid}.jpg
       │    Returns public URL
       ▼
┌─────────────┐
│ Database    │
│ Insert      │
└──────┬──────┘
       │ 4. Trigger checks caps (30 total, 5 standalone)
       │    If OK: Insert row with source_type='standalone'
       │    If FAIL: Reject + rollback storage file
       ▼
┌─────────────┐
│ Public      │
│ Gallery     │
│ Page        │
└─────────────┘
       5. Fetch gallery_items ordered by sort_order
          Render responsive grid with lazy loading
```

### Admin Adds Project Image Reference

```
┌─────────────┐
│ Admin UI    │
│ Select from │
│ Projects    │
└──────┬──────┘
       │ 1. Admin picks existing project image
       │    (no upload, image already in projects/{id}/)
       ▼
┌─────────────┐
│ Database    │
│ Insert      │
└──────┬──────┘
       │ 2. Insert row with:
       │    - image_url: existing URL
       │    - source_type: 'project'
       │    - project_id: reference to project
       │    Trigger checks total cap (30)
       ▼
┌─────────────┐
│ Public      │
│ Gallery     │
└─────────────┘
       3. Image appears in gallery
          (same storage file, new DB reference)
```

### Public User Views Gallery

```
┌─────────────┐
│ Browser     │
│ Visits      │
│ /gallery    │
└──────┬──────┘
       │ 1. Page loads, Vue component mounts
       ▼
┌─────────────┐
│ Fetch       │
│ gallery_    │
│ items       │
└──────┬──────┘
       │ 2. SELECT * FROM gallery_items
       │    ORDER BY sort_order, created_at
       │    (RLS allows public read)
       ▼
┌─────────────┐
│ Render Grid │
│ with Lazy   │
│ Loading     │
└──────┬──────┘
       │ 3. Images load as user scrolls
       │    (loading="lazy" attribute)
       ▼
┌─────────────┐
│ Display     │
│ Alt text    │
│ Caption     │
│ Source      │
│ Badge       │
└─────────────┘
```

---

## PART 8: TESTING CHECKLIST

### Backend Tests (via SQL Editor)

```sql
-- Test 1: Insert standalone item
INSERT INTO gallery_items (image_url, source_type, alt_text)
VALUES ('https://example.com/test.jpg', 'standalone', 'Test image');
-- Expected: Success

-- Test 2: Try to insert 6th standalone
-- (After inserting 5 standalone items)
INSERT INTO gallery_items (image_url, source_type, alt_text)
VALUES ('https://example.com/test6.jpg', 'standalone', 'Test 6');
-- Expected: Error "Standalone gallery cap reached"

-- Test 3: Try to insert 31st item
-- (After inserting 30 total items)
INSERT INTO gallery_items (image_url, source_type, alt_text)
VALUES ('https://example.com/test31.jpg', 'project', 'Test 31');
-- Expected: Error "Gallery cap reached"

-- Test 4: Insert duplicate
INSERT INTO gallery_items (image_url, source_type, alt_text)
VALUES ('https://example.com/test.jpg', 'standalone', 'Duplicate');
-- Expected: Error "duplicate key value violates unique constraint"

-- Test 5: Verify ordering
SELECT image_url, sort_order, created_at 
FROM gallery_items 
ORDER BY sort_order ASC, created_at ASC;
-- Expected: Results in correct order
```

### Frontend Tests (Manual)

1. **Upload standalone image**
   - Select 2MB image
   - Verify compression reduces size
   - Check image appears in gallery
   - Confirm storage path is `gallery/standalone/`

2. **Add project reference**
   - Select existing project image
   - Verify no duplicate upload
   - Confirm `project_id` is set in DB

3. **Test caps**
   - Add 5 standalone images
   - Try to add 6th → expect error message
   - Add 25 project references (total 30)
   - Try to add 31st → expect error message

4. **Test deletion**
   - Delete standalone item → verify file removed from storage
   - Delete project reference → verify file NOT removed (still in projects/)
   - Confirm DB row deleted in both cases

5. **Public gallery**
   - Open `/gallery` in incognito (logged out)
   - Verify all images load
   - Check lazy loading (images load as you scroll)
   - Confirm alt text appears on hover

---

## PART 9: PRODUCTION CHECKLIST

### Security

- [ ] RLS enabled on `gallery_items` table
- [ ] Storage policies restrict uploads to authenticated users
- [ ] Admin auth uses secure passwords (not "admin123")
- [ ] Service role key never exposed client-side
- [ ] CORS configured correctly in Supabase settings

### Performance

- [ ] Images compressed before upload (max 1920px, 85% quality)
- [ ] Public bucket enabled for direct CDN access
- [ ] Database indexes created (sort_order, created_at)
- [ ] Lazy loading implemented on public gallery
- [ ] Cache-Control headers set on storage uploads

### Backup

- [ ] Database automated backups enabled (Supabase Pro)
- [ ] Storage bucket backed up regularly
- [ ] Admin credentials stored in password manager
- [ ] `.env` file added to `.gitignore`

### Monitoring

- [ ] Set up Supabase alerting for failed queries
- [ ] Monitor storage usage (quota limits)
- [ ] Track orphaned files (run cleanup script monthly)
- [ ] Log all admin actions (uploads, deletions)

---

## PART 10: TROUBLESHOOTING

### "new row violates row-level security policy"

**Cause**: RLS is enabled but user is not authenticated.

**Fix**: Ensure admin is logged in before attempting insert/update/delete.

```typescript
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  throw new Error('Not authenticated')
}
```

### "Gallery cap reached" error after deleting item

**Cause**: Trigger counts rows before insert. If count is exactly 30 and you delete one, next insert should work.

**Fix**: Refresh page to re-fetch count, or adjust trigger logic to use `<` instead of `>=`.

### Image URL returns 404

**Cause**: Storage bucket is private, or file was deleted.

**Fix**: 
1. Check bucket is public: Storage → project-images → Settings → Public
2. Verify file exists: Storage → project-images → Browse to path
3. Check URL format: Should be `https://{project-ref}.supabase.co/storage/v1/object/public/project-images/...`

### Orphaned files in storage

**Cause**: DB delete succeeded but storage delete failed.

**Fix**: Run cleanup script:

```typescript
// Pseudo-code for cleanup job
async function cleanupOrphanedFiles() {
  // 1. List all files in gallery/standalone/
  const { data: files } = await supabase.storage
    .from('project-images')
    .list('gallery/standalone/')
  
  // 2. Fetch all standalone gallery items from DB
  const { data: dbItems } = await supabase
    .from('gallery_items')
    .select('image_url')
    .eq('source_type', 'standalone')
  
  const dbUrls = new Set(dbItems.map(item => item.image_url))
  
  // 3. Find files not in DB
  const orphans = files.filter(file => {
    const fullUrl = `https://.../gallery/standalone/${file.name}`
    return !dbUrls.has(fullUrl)
  })
  
  // 4. Delete orphans older than 7 days
  const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000)
  const toDelete = orphans.filter(file => 
    new Date(file.created_at).getTime() < cutoff
  )
  
  await supabase.storage
    .from('project-images')
    .remove(toDelete.map(f => `gallery/standalone/${f.name}`))
  
  console.log(`Cleaned up ${toDelete.length} orphaned files`)
}
```

---

## Summary

You now have:

1. ✅ Supabase project with authentication
2. ✅ `gallery_items` table with enforced caps and uniqueness
3. ✅ Storage bucket with admin-write, public-read policies
4. ✅ RLS policies protecting data
5. ✅ Frontend functions for upload, reference, and delete
6. ✅ Rollback strategies for error handling
7. ✅ Complete data flow from admin → public gallery

**Next Steps:**
1. Run all SQL scripts in Supabase SQL Editor
2. Test upload/delete flows in admin panel
3. Verify public gallery loads correctly
4. Set up monitoring and backups
5. Deploy to production

**Questions or issues?** Check the troubleshooting section or Supabase docs: [https://supabase.com/docs](https://supabase.com/docs)
