# Manual Google Reviews Setup Guide

Since Google Cloud billing verification isn't working, we're using a **manual review import system**. This is completely free and still displays your authentic Google reviews!

## How It Works

Your real Google reviews are stored in `/data/google-reviews.json` and displayed on your website automatically. When you get new reviews, simply update this file.

## Current Review in the File

```json
{
  "author_name": "Aryan",
  "rating": 5,
  "text": "Excellent work! Thapa Construction delivered exceptional quality..."
}
```

## How to Add New Reviews

### Option 1: Copy from Google My Business (Recommended)

1. **Go to your Google Business Profile:**
   - Visit: https://business.google.com/
   - Sign in with your business account
   - Click on your business (Thapa Construction)

2. **View your reviews:**
   - Click "Reviews" in the left sidebar
   - You'll see all reviews with full text

3. **Copy review details:**
   - Author name
   - Star rating (1-5)
   - Review text
   - When it was posted

4. **Update the JSON file:**
   - Open `/data/google-reviews.json`
   - Add new review to the `reviews` array
   - Update `rating` (average of all ratings)
   - Update `user_ratings_total` (total count)

### Option 2: Use the Template Below

Copy this template for each new review:

```json
{
  "author_name": "Customer Name",
  "author_url": "",
  "profile_photo_url": "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
  "rating": 5,
  "relative_time_description": "1 week ago",
  "text": "The full review text goes here...",
  "time": 1736006400,
  "language": "en"
}
```

## Example: Adding a Second Review

If you get a new 4-star review from "Sanjay Rai", update the file like this:

```json
{
  "result": {
    "name": "Thapa Construction",
    "rating": 4.5,
    "user_ratings_total": 2,
    "reviews": [
      {
        "author_name": "Aryan",
        "rating": 5,
        "relative_time_description": "2 days ago",
        "text": "Excellent work! Thapa Construction delivered exceptional quality...",
        "time": 1736006400,
        "profile_photo_url": "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
        "author_url": "",
        "language": "en"
      },
      {
        "author_name": "Sanjay Rai",
        "rating": 4,
        "relative_time_description": "1 day ago",
        "text": "Great service and quality work. Very professional team.",
        "time": 1736092800,
        "profile_photo_url": "https://lh3.googleusercontent.com/a/default-user=s128-c0x00000000-cc-rp-mo",
        "author_url": "",
        "language": "en"
      }
    ]
  }
}
```

**Note:** Calculate average rating: `(5 + 4) / 2 = 4.5`

## Quick Update Checklist

When adding a new review:
- [ ] Add review object to `reviews` array
- [ ] Update `rating` (calculate new average)
- [ ] Update `user_ratings_total` (increment by 1)
- [ ] Save the file
- [ ] Refresh your website (cache clears after 24 hours, or restart dev server)

## Testing Your Changes

### Locally:
```bash
npm run dev
```
Then visit: http://localhost:3000/api/reviews/google

You should see:
```json
{
  "source": "local_file",
  "info": "Reviews loaded from local file (google-reviews.json)"
}
```

### After Deploying to Vercel:
Your reviews will automatically update on your live site!

## Benefits of This Approach

✅ **Completely free** - No API costs or billing requirements  
✅ **No credit card needed** - Avoid billing verification issues  
✅ **Full control** - Choose which reviews to display  
✅ **Easy to maintain** - Simple JSON file editing  
✅ **Always works** - No API quotas or restrictions  
✅ **Same look** - Users won't notice any difference  

## Optional: Auto-Sync Script (Advanced)

If you want to automate this later, you can:
1. Enable Google Cloud billing when the issue is resolved
2. The system will automatically switch to live API
3. Your manual reviews will serve as backup

## Need Help?

If you need assistance adding new reviews, just share:
- Screenshot of the review from Google Business
- Or the review text, rating, and author name

I'll format it correctly for you!
