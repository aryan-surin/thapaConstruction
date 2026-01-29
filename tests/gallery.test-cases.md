# Gallery Test Cases (Manual)

## Caps and Limits
- Add 30 mixed items (project + standalone) and verify the 31st insert is blocked with cap message.
- Add 5 standalone uploads and verify the 6th upload is blocked on both UI and Supabase trigger.
- Remove one item and verify addition becomes allowed again.

## Uniqueness
- Attempt to add the same project image twice; expect duplicate warning and no new row.
- Add different project images with identical filenames but different paths; both should succeed.

## Sorting
- Update `sort_order` for several items and verify ordering reflects sort_order ASC then created_at ASC.
- Save invalid sort input (non-number) and confirm validation error.

## Project Selection
- Filter by a specific project and ensure only its assets display.
- Add cover, hero, and gallery images from the same project; ensure all link back via `project_id`.

## Standalone Uploads
- Upload an image to `gallery/standalone/` and verify public URL resolves and row is created with `source_type = standalone` and `project_id = null`.
- Upload with missing alt text; expect client-side validation failure.

## Deletion
- Delete a project-based gallery item and confirm counts decrement and caps allow further inserts.
- Delete a standalone item and confirm standalone count decrements.

## Error Paths
- Simulate Supabase network failure during upload; expect error message and no partial state addition.
- Trigger unique constraint violation and confirm user-facing duplicate message appears.
