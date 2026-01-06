# Google Reviews Integration - Complete Setup Guide

## 📋 Overview

This guide will walk you through setting up Google Reviews integration for Thapa Construction website. The implementation uses Google Places API to display authentic customer reviews directly on your website.

---

## 🎯 What You'll Achieve

- ✅ Display real Google reviews on your website
- ✅ Show aggregate rating (stars + count)
- ✅ Automatic 24-hour caching (minimize API costs)
- ✅ Fallback to testimonials if API fails
- ✅ SEO-optimized with schema markup
- ✅ Mobile-responsive design

---

## 📊 Current Implementation

### Files Created:
1. `/types/reviews.d.ts` - TypeScript interfaces
2. `/server/api/reviews/google.ts` - Server API route
3. `/stores/reviews.ts` - Pinia state management
4. `/components/GoogleReviewsSection.vue` - Main reviews section
5. `/components/GoogleReviewCard.vue` - Individual review card
6. `/components/GoogleRatingBadge.vue` - Rating badge component

### Pages Updated:
- `/pages/index.vue` - Added Google Reviews after FAQs (4 reviews)
- `/pages/contact.vue` - Added Google Reviews after FAQs (all reviews)

---

## 🔑 Step 1: Get Your Google Place ID

Your business share link: `https://share.google/Gucnqw7ZtNnlDuIUM`

We need to convert this to a Place ID. Here's how:

### Method 1: Using Place ID Finder (Easiest)

1. Go to: https://developers.google.com/maps/documentation/places/web-service/place-id
2. Search for "Thapa Construction, Darjeeling"
3. Click on your business location
4. Copy the Place ID (format: `ChIJ...`)

### Method 2: Manual API Call

Once you have an API key (next step), you can find your Place ID:

```bash
curl "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Thapa%20Construction%20Panchanadi%20Dagapur%20Darjeeling&inputtype=textquery&fields=place_id,name&key=YOUR_API_KEY"
```

**Expected Response:**
```json
{
  "candidates": [
    {
      "place_id": "ChIJXXXXXXXXXXXXXXXXXXXX",
      "name": "Thapa Construction"
    }
  ]
}
```

---

## ☁️ Step 2: Set Up Google Cloud Platform

### 2.1 Create Google Cloud Account

1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Accept Terms of Service
4. **Important:** You'll need to add billing information, but **don't worry** - Google offers:
   - $300 free credit for new users (90 days)
   - 28,000 free Places API requests/month (always free)
   - Your website will likely stay within free tier

### 2.2 Create a New Project

1. Click "Select a project" dropdown (top bar)
2. Click "New Project"
3. Enter project name: **"Thapa Construction Website"**
4. Click "Create"
5. Wait for project creation (~30 seconds)
6. Select your new project from the dropdown

### 2.3 Enable Places API

1. Go to: https://console.cloud.google.com/apis/library/places-backend.googleapis.com
2. Click "Enable" button
3. Wait for API to be enabled (~1 minute)

### 2.4 Create API Key

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "+ CREATE CREDENTIALS"
3. Select "API key"
4. Copy your API key immediately (looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
5. Click "Restrict Key" (important for security!)

### 2.5 Restrict API Key (Security)

**API Restrictions:**
1. Click "Restrict key"
2. Under "API restrictions", select "Restrict key"
3. From dropdown, select only: **"Places API"**
4. Click "Save"

**Application Restrictions (Optional but Recommended):**
1. Under "Application restrictions", select "HTTP referrers"
2. Add your domains:
   ```
   yourdomain.com/*
   *.vercel.app/*
   localhost:3000/*
   ```
3. Click "Save"

---

## 🔐 Step 3: Configure Environment Variables

### 3.1 Update Your `.env` File

Your `.env` file has been pre-configured with placeholders. Update it with your values:

```bash
# Existing Supabase Config (don't change)
NUXT_PUBLIC_SUPABASE_URL=https://pffcvzvcqfzgckinhgbz.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGci...

# Google Places API Configuration (UPDATE THESE)
GOOGLE_PLACES_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_PLACE_ID=ChIJXXXXXXXXXXXXXXXXXXXX
```

**Replace:**
- `YOUR_API_KEY_HERE` → Your actual Google API key
- `YOUR_PLACE_ID_HERE` → Your actual Google Place ID

### 3.2 Verify `.gitignore`

Ensure `.env` is in your `.gitignore` file (it should already be there):

```
# .gitignore
.env
.env.local
.env.*.local
```

---

## 🚀 Step 4: Test Locally

### 4.1 Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Start fresh
npm run dev
```

### 4.2 Test API Endpoint

Open browser and navigate to:
```
http://localhost:3000/api/reviews/google
```

**Expected Response (Success):**
```json
{
  "reviews": [...],
  "aggregateRating": {
    "rating": 4.8,
    "total_reviews": 5,
    "user_ratings_total": 5
  },
  "source": "google",
  "fetchedAt": 1735660800000
}
```

**If API Key Not Set (Fallback):**
```json
{
  "reviews": [...hardcoded testimonials...],
  "aggregateRating": {...},
  "source": "fallback",
  "warning": "Using fallback reviews due to API error"
}
```

### 4.3 Test Website Pages

1. **Home Page:** `http://localhost:3000/`
   - Scroll to bottom
   - Should see "Verified Google Reviews" section with 4 reviews

2. **Contact Page:** `http://localhost:3000/contact`
   - Scroll to "What Our Clients Say" section
   - Should see all Google reviews

### 4.4 Check Browser Console

Open Developer Tools (F12) and check console for:
```
[Reviews Store] Fetching reviews from API
[Google Reviews API] Fetching reviews from Google Places API
[Google Reviews API] Successfully fetched X reviews
```

---

## 🌐 Step 5: Deploy to Vercel

### 5.1 Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: **"Thapa Construction"**
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Environments |
|------|-------|--------------|
| `GOOGLE_PLACES_API_KEY` | `AIzaSy...` (your API key) | Production, Preview, Development |
| `GOOGLE_PLACE_ID` | `ChIJ...` (your Place ID) | Production, Preview, Development |

5. Click "Save"

### 5.2 Redeploy

1. Go to **Deployments** tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

### 5.3 Verify Production

Visit your live site and check reviews sections work correctly.

---

## 🎨 Step 6: Customize (Optional)

### Change Review URL for "Leave a Review" Button

Edit `/components/GoogleReviewsSection.vue`:

```typescript
// Line ~175
const googleBusinessUrl = 'https://g.page/r/YOUR_PLACE_ID/review';
```

**To find your review URL:**
1. Visit your Google Business Profile
2. Click "Get more reviews"
3. Copy the short URL provided
4. Update the component

### Adjust Number of Reviews Displayed

**Home Page** (`/pages/index.vue`):
```vue
<GoogleReviewsSection 
  :limit="6"  <!-- Change from 4 to 6 -->
  ...
/>
```

**Contact Page** (shows all by default):
```vue
<GoogleReviewsSection 
  :limit="10"  <!-- Add limit if you want -->
  ...
/>
```

### Filter by Rating

Show only 4-5 star reviews:
```vue
<GoogleReviewsSection 
  :min-rating="4"  <!-- Only 4+ star reviews -->
  ...
/>
```

---

## 📊 Step 7: Monitor Usage & Costs

### Check API Usage

1. Go to: https://console.cloud.google.com/apis/dashboard
2. Select your project
3. View **Places API** usage
4. Monitor requests/day

### Expected Usage

With 24-hour caching:
- ~1 API call per day (cache refresh)
- ~30 calls per month
- **Cost:** FREE (well within 28,000 free quota)

### Set Up Budget Alerts (Recommended)

1. Go to: https://console.cloud.google.com/billing/budgets
2. Click "Create Budget"
3. Set budget to **$5/month**
4. Add email alerts at 50%, 90%, 100%
5. This protects you from unexpected costs

---

## 🔧 Troubleshooting

### Issue: "API key not configured" Error

**Solution:**
1. Check `.env` file has correct `GOOGLE_PLACES_API_KEY`
2. Restart development server: `npm run dev`
3. Clear browser cache

### Issue: "ZERO_RESULTS" or No Reviews Showing

**Possible Causes:**
1. Wrong Place ID
2. Business has no public reviews
3. API key restrictions too strict

**Solution:**
1. Verify Place ID using Place ID Finder
2. Check your Google Business Profile has public reviews
3. Temporarily remove API key restrictions for testing

### Issue: Reviews Show but Rating is 0

**Solution:**
- Your business may not have enough reviews yet
- Google requires minimum 5 reviews to show aggregate rating
- Fallback testimonials will display until then

### Issue: "OVER_QUERY_LIMIT" Error

**Solution:**
1. Check API quota: https://console.cloud.google.com/apis/dashboard
2. Verify billing is enabled on Google Cloud
3. Cache should prevent this with 24-hour refresh

### Issue: Reviews Not Updating

**Solution:**
1. Cache is working correctly (24-hour refresh)
2. To force refresh, clear server cache:
   - Restart server: `npm run dev`
   - Or wait 24 hours for automatic refresh

---

## 🎓 Understanding the Code

### How Caching Works

```
User visits page
    ↓
Check cache (24 hours fresh?)
    ↓ Yes → Return cached reviews
    ↓ No
Fetch from Google API
    ↓ Success → Update cache, return reviews
    ↓ Error → Return cached (if exists) or fallback testimonials
```

### Fallback Strategy

```
1. Try Google API
2. If fail, use cached data (even if expired)
3. If no cache, use hardcoded testimonials
4. Always show something to user!
```

### Data Flow

```
Google Places API
    ↓
Server API Route (/api/reviews/google)
    ↓ (caches 24 hours)
Pinia Store (state management)
    ↓
Vue Components (UI display)
```

---

## 📈 Next Steps & Enhancements

### Phase 2 Features (Future)

1. **Review Analytics Dashboard**
   - Track review trends
   - Average rating over time
   - Response rate

2. **Review Response System**
   - Respond to reviews from website
   - Automated thank-you messages

3. **Review Notifications**
   - Email alerts for new reviews
   - Slack/Discord webhooks

4. **Advanced Filtering**
   - Filter by keyword
   - Search reviews
   - Sort options (newest, highest rated, etc.)

5. **Review Highlights**
   - Auto-extract key phrases
   - Sentiment analysis
   - Featured review of the month

---

## 📞 Support & Resources

### Google Cloud Documentation
- Places API: https://developers.google.com/maps/documentation/places/web-service/overview
- API Key Best Practices: https://cloud.google.com/docs/authentication/api-keys
- Pricing Calculator: https://cloud.google.com/products/calculator

### Nuxt 3 Documentation
- Server Routes: https://nuxt.com/docs/guide/directory-structure/server
- Pinia Store: https://pinia.vuejs.org/

### Vercel Documentation
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables

---

## ✅ Checklist

Before going live, ensure:

- [ ] Google Cloud account created
- [ ] Places API enabled
- [ ] API key created and restricted
- [ ] Place ID obtained
- [ ] `.env` file updated with correct values
- [ ] Tested locally (both pages work)
- [ ] Environment variables added to Vercel
- [ ] Deployed and tested in production
- [ ] Budget alerts configured
- [ ] Review URL updated in component
- [ ] `.env` file NOT committed to Git

---

## 🎉 Congratulations!

Your Google Reviews integration is complete! Your website now displays authentic customer reviews that build trust and credibility with potential clients.

**Remember:** Reviews refresh automatically every 24 hours, so your site always shows the latest feedback!

---

**Last Updated:** December 31, 2025  
**Version:** 1.0.0  
**Author:** GitHub Copilot  
**Project:** Thapa Construction Website
