# Gallery Admin Notes

## Setup Instructions
- Ensure environment variables for Supabase are set: `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_KEY`.
- Run `npm install` to confirm dependencies, then `npm run dev` to start the admin UI.
- Apply the `gallery_items` SQL schema and trigger provided earlier before using the page.

## Dependencies (key versions)
- nuxt ^3.8.0
- vue ^3.3.4
- pinia ^3.0.3
- @supabase/supabase-js ^2.86.0

## Usage Examples
- Manage project-sourced gallery entries: Admin → Manage Gallery → "Add Project Images" card → select project asset → fill alt text → Add.
- Upload standalone: Admin → Manage Gallery → "Upload Standalone Images" → pick file → alt text → Upload. Standalone uploads stored at `project-images/gallery/standalone/`.

## Known Limitations
- Sorting is per-item via numeric input; no drag-and-drop yet.
- Upload size limits follow Supabase bucket defaults; no client-side compression.
- Frontend enforces caps, but server constraints must also be in place to avoid bypass.

## Troubleshooting Guide
- Duplicate warning: occurs if (source_type, image_url) already exists; pick another image.
- Cap errors: remove items if 30 total or 5 standalone are reached before adding more.
- Missing images: ensure Supabase storage bucket `project-images` contains the referenced path and public URLs are enabled.
- Auth issues: re-login via `/admin/login`; ensure session has insert/update/delete permissions on `gallery_items` table.
