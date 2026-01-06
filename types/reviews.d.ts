/**
 * Google Reviews Type Definitions
 * 
 * TypeScript interfaces for Google Places API reviews integration.
 * Defines types for reviews, ratings, and API responses.
 * 
 * @module types/reviews
 */

/**
 * Google Review Interface
 * 
 * Represents a single review from Google Places API
 * 
 * @interface GoogleReview
 */
export interface GoogleReview {
  /** Unique identifier for the review */
  id: string;
  
  /** Name of the reviewer */
  author_name: string;
  
  /** URL to the reviewer's profile */
  author_url?: string;
  
  /** URL to the reviewer's profile photo */
  profile_photo_url?: string;
  
  /** Star rating (1-5) */
  rating: number;
  
  /** Relative time description (e.g., "2 months ago") */
  relative_time_description: string;
  
  /** Full review text */
  text: string;
  
  /** Unix timestamp of when the review was written */
  time: number;
  
  /** Language code of the review */
  language?: string;
  
  /** Business owner's response to the review (if any) */
  reply?: {
    comment: string;
    time: number;
  };
}

/**
 * Aggregate Rating Interface
 * 
 * Overall rating statistics for the business
 * 
 * @interface AggregateRating
 */
export interface AggregateRating {
  /** Average rating (1-5) */
  rating: number;
  
  /** Total number of reviews */
  total_reviews: number;
  
  /** Total number of ratings (may differ from reviews) */
  user_ratings_total: number;
}

/**
 * Google Places API Response Interface
 * 
 * Response structure from Google Places API
 * 
 * @interface GooglePlacesResponse
 */
export interface GooglePlacesResponse {
  /** Array of reviews */
  reviews: GoogleReview[];
  
  /** Overall rating */
  rating: number;
  
  /** Total number of user ratings */
  user_ratings_total: number;
  
  /** Status of the API request */
  status: 'OK' | 'ZERO_RESULTS' | 'INVALID_REQUEST' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR';
  
  /** Error message if status is not OK */
  error_message?: string;
}

/**
 * Reviews State Interface
 * 
 * Pinia store state structure for reviews
 * 
 * @interface ReviewsState
 */
export interface ReviewsState {
  /** Array of Google reviews */
  reviews: GoogleReview[];
  
  /** Aggregate rating data */
  aggregateRating: AggregateRating | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;
  
  /** Timestamp of last fetch */
  lastFetched: number | null;
  
  /** Cache duration in milliseconds */
  cacheDuration: number;
}

/**
 * Review Filter Options Interface
 * 
 * Options for filtering and sorting reviews
 * 
 * @interface ReviewFilterOptions
 */
export interface ReviewFilterOptions {
  /** Minimum rating to show (1-5) */
  minRating?: number;
  
  /** Maximum number of reviews to show */
  limit?: number;
  
  /** Sort order */
  sortBy?: 'rating' | 'date' | 'helpful';
  
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
}

/**
 * API Error Response Interface
 * 
 * Error response structure from server API
 * 
 * @interface ApiErrorResponse
 */
export interface ApiErrorResponse {
  /** Error message */
  error: string;
  
  /** HTTP status code */
  statusCode: number;
  
  /** Additional error details */
  details?: unknown;
}

/**
 * Review Component Props Interface
 * 
 * Props for GoogleReviewsSection component
 * 
 * @interface ReviewSectionProps
 */
export interface ReviewSectionProps {
  /** Maximum number of reviews to display */
  limit?: number;
  
  /** Section title */
  title?: string;
  
  /** Section description */
  description?: string;
  
  /** Background CSS class */
  backgroundClass?: string;
  
  /** Show aggregate rating badge */
  showRating?: boolean;
  
  /** Show "Leave a Review" button */
  showCta?: boolean;
  
  /** Enable SEO schema markup */
  withSchema?: boolean;
  
  /** Minimum rating to display (1-5) */
  minRating?: number;
}
