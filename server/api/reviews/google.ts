/**
 * Google Reviews API Route
 * 
 * Server-side API endpoint for fetching Google Reviews from Places API.
 * Implements caching strategy to minimize API calls and provides graceful fallback.
 * 
 * Priority order:
 * 1. Cache (if fresh within 24 hours)
 * 2. Google Places API (real-time data - primary source)
 * 3. Local JSON file (data/google-reviews.json - backup when API fails)
 * 4. Expired cache (if API and local file unavailable)
 * 5. Fallback testimonials (last resort)
 * 
 * @module server/api/reviews/google
 */

import type { GooglePlacesResponse, GoogleReview, AggregateRating } from '~/types/reviews';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Cache storage for reviews
 * In production, consider using Redis or another persistent cache
 */
interface CacheEntry {
  reviews: GoogleReview[];
  aggregateRating: AggregateRating;
  timestamp: number;
}

let reviewsCache: CacheEntry | null = null;

/**
 * Cache duration: 24 hours in milliseconds
 * Reviews don't change frequently, so 24-hour cache is appropriate
 */
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Google Place ID for Thapa Construction
 */
const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'YOUR_PLACE_ID_HERE';

/**
 * Google Places API Key
 * Must be set in .env file as GOOGLE_PLACES_API_KEY
 */
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

/**
 * Load reviews from local JSON file (Manual Import System)
 * This is the primary source when Google API billing is not enabled
 * 
 * @returns {Promise<{ reviews: GoogleReview[], aggregateRating: AggregateRating } | null>}
 */
async function getLocalReviews(): Promise<{ reviews: GoogleReview[], aggregateRating: AggregateRating } | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'google-reviews.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    const reviews: GoogleReview[] = data.result.reviews || [];
    const aggregateRating: AggregateRating = {
      rating: data.result.rating || 0,
      total_reviews: reviews.length,
      user_ratings_total: data.result.user_ratings_total || 0
    };

    // eslint-disable-next-line no-console
    console.log(`[Google Reviews API] Loaded ${reviews.length} reviews from local file`);
    
    return { reviews, aggregateRating };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Google Reviews API] Error reading local reviews file:', error);
    return null;
  }
}

/**
 * Fetch reviews from Google Places API
 * 
 * @returns {Promise<{ reviews: GoogleReview[], aggregateRating: AggregateRating }>}
 * @throws {Error} If API request fails
 */
async function fetchFromGoogleAPI(): Promise<{ reviews: GoogleReview[], aggregateRating: AggregateRating }> {
  if (!API_KEY) {
    throw new Error('Google Places API key not configured');
  }

  if (!PLACE_ID || PLACE_ID === 'YOUR_PLACE_ID_HERE') {
    throw new Error('Google Place ID not configured');
  }

  // Google Places API endpoint for Place Details
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total,name&key=${API_KEY}`;

  try {
    // eslint-disable-next-line no-console
    console.log('[Google Reviews API] Fetching reviews from Google Places API');

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google API returned ${response.status}: ${response.statusText}`);
    }

    const data: GooglePlacesResponse = await response.json();

    // Check API response status
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    // Extract reviews and rating data
    const reviews: GoogleReview[] = data.reviews || [];
    const aggregateRating: AggregateRating = {
      rating: data.rating || 0,
      total_reviews: reviews.length,
      user_ratings_total: data.user_ratings_total || 0
    };

    // eslint-disable-next-line no-console
    console.log(`[Google Reviews API] Successfully fetched ${reviews.length} reviews`);

    return { reviews, aggregateRating };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Google Reviews API] Error fetching from Google:', error);
    throw error;
  }
}

/**
 * Get fallback reviews when everything else fails
 * Returns hardcoded testimonials as backup
 * 
 * @returns {{ reviews: GoogleReview[], aggregateRating: AggregateRating }}
 */
function getFallbackReviews(): { reviews: GoogleReview[], aggregateRating: AggregateRating } {
  // eslint-disable-next-line no-console
  console.log('[Google Reviews API] Using fallback reviews (hardcoded testimonials)');

  // Convert hardcoded testimonials to Google Review format
  const fallbackReviews: GoogleReview[] = [
    {
      id: 'fallback-1',
      author_name: 'Rajesh Kumar',
      rating: 5,
      text: 'Thapa Construction built our dream home with exceptional attention to detail. Their team was professional, and they completed the project on time and within budget.',
      relative_time_description: 'Client testimonial',
      time: Date.now() / 1000,
      profile_photo_url: '/images/testimonials/person1.jpg'
    },
    {
      id: 'fallback-2',
      author_name: 'Priya Sharma',
      rating: 5,
      text: 'We hired Thapa Construction for our restaurant renovation and the results were outstanding. Their expertise and quality craftsmanship transformed our space completely.',
      relative_time_description: 'Client testimonial',
      time: Date.now() / 1000,
      profile_photo_url: '/images/testimonials/person2.jpg'
    },
    {
      id: 'fallback-3',
      author_name: 'Anand Thapa',
      rating: 5,
      text: 'The architectural design and construction quality provided by Thapa Construction for our mountain resort was excellent. They understood our vision perfectly.',
      relative_time_description: 'Client testimonial',
      time: Date.now() / 1000,
      profile_photo_url: '/images/testimonials/person3.jpg'
    }
  ];

  const aggregateRating: AggregateRating = {
    rating: 5.0,
    total_reviews: 3,
    user_ratings_total: 3
  };

  return { reviews: fallbackReviews, aggregateRating };
}

/**
 * Main API route handler
 * 
 * GET /api/reviews/google
 * 
 * Returns cached reviews if available and fresh, otherwise tries:
 * 1. Local JSON file
 * 2. Google Places API
 * 3. Fallback testimonials
 * 
 * @param {H3Event} event - Nuxt H3 event object
 * @returns {Promise<{ reviews: GoogleReview[], aggregateRating: AggregateRating, source: string }>}
 */
export default defineEventHandler(async (event) => {
  try {
    const now = Date.now();

    // Check if we have valid cached data
    if (reviewsCache && (now - reviewsCache.timestamp) < CACHE_DURATION) {
      // eslint-disable-next-line no-console
      console.log('[Google Reviews API] Returning cached reviews');
      
      return {
        reviews: reviewsCache.reviews,
        aggregateRating: reviewsCache.aggregateRating,
        source: 'cache',
        cachedAt: reviewsCache.timestamp
      };
    }

    // Priority 1: Try Google Places API first (real-time data)
    if (API_KEY && PLACE_ID && PLACE_ID !== 'YOUR_PLACE_ID_HERE') {
      try {
        const { reviews, aggregateRating } = await fetchFromGoogleAPI();

        // Update cache with fresh Google data
        reviewsCache = {
          reviews,
          aggregateRating,
          timestamp: now
        };

        return {
          reviews,
          aggregateRating,
          source: 'google_api',
          fetchedAt: now,
          info: 'Live data from Google Places API'
        };
      } catch (apiError) {
        // eslint-disable-next-line no-console
        console.error('[Google Reviews API] Google API failed, trying fallback sources:', apiError);
      }
    }

    // Priority 2: Fallback to local JSON file (manual backup)
    const localReviews = await getLocalReviews();
    if (localReviews) {
      // Update cache with local reviews
      reviewsCache = {
        reviews: localReviews.reviews,
        aggregateRating: localReviews.aggregateRating,
        timestamp: now
      };

      return {
        reviews: localReviews.reviews,
        aggregateRating: localReviews.aggregateRating,
        source: 'local_file',
        fetchedAt: now,
        info: 'Using backup reviews from google-reviews.json (Google API unavailable)'
      };
    }

    // Priority 3: Use expired cache if available
    if (reviewsCache) {
      // eslint-disable-next-line no-console
      console.log('[Google Reviews API] Returning expired cache');
      
      return {
        reviews: reviewsCache.reviews,
        aggregateRating: reviewsCache.aggregateRating,
        source: 'cache-expired',
        cachedAt: reviewsCache.timestamp,
        warning: 'Using expired cache (API failed, local file unavailable)'
      };
    }

    // Priority 4: Last resort - hardcoded testimonials
    const { reviews, aggregateRating } = getFallbackReviews();
    
    return {
      reviews,
      aggregateRating,
      source: 'fallback',
      warning: 'Using fallback testimonials (all other sources unavailable)'
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Google Reviews API] Unexpected error:', error);

    // Last resort: return fallback reviews
    const { reviews, aggregateRating } = getFallbackReviews();
    
    return {
      reviews,
      aggregateRating,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
});
