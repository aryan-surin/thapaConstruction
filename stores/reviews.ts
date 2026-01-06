/**
 * Reviews Pinia Store
 * 
 * Centralized state management for Google Reviews.
 * Handles fetching, caching, and error states for reviews across the application.
 * 
 * @module stores/reviews
 */

import { defineStore } from 'pinia';
import type { GoogleReview, AggregateRating, ReviewsState } from '~/types/reviews';

/**
 * Reviews Store
 * 
 * Manages the state and actions for Google Reviews integration.
 * Provides methods to fetch reviews from the API with built-in caching and error handling.
 * 
 * @example
 * ```typescript
 * const reviewsStore = useReviewsStore();
 * await reviewsStore.fetchReviews();
 * const reviews = reviewsStore.getReviews(4); // Get first 4 reviews
 * ```
 */
export const useReviewsStore = defineStore('reviews', {
  /**
   * Store State
   */
  state: (): ReviewsState => ({
    /** Array of fetched reviews */
    reviews: [],
    
    /** Aggregate rating data (average, total count) */
    aggregateRating: null,
    
    /** Loading state indicator */
    loading: false,
    
    /** Error message if fetch fails */
    error: null,
    
    /** Timestamp of last successful fetch */
    lastFetched: null,
    
    /** Cache duration in milliseconds (24 hours) */
    cacheDuration: 24 * 60 * 60 * 1000
  }),

  /**
   * Store Getters
   */
  getters: {
    /**
     * Check if cached data is still fresh
     * 
     * @param {ReviewsState} state - Current store state
     * @returns {boolean} True if cache is valid
     */
    isCacheFresh: (state): boolean => {
      if (!state.lastFetched) return false;
      const now = Date.now();
      return (now - state.lastFetched) < state.cacheDuration;
    },

    /**
     * Get filtered reviews by minimum rating
     * 
     * @param {ReviewsState} state - Current store state
     * @returns {Function} Function that filters reviews by rating
     */
    getReviewsByRating: (state) => (minRating: number = 1): GoogleReview[] => {
      return state.reviews.filter(review => review.rating >= minRating);
    },

    /**
     * Get limited number of reviews
     * 
     * @param {ReviewsState} state - Current store state
     * @returns {Function} Function that returns limited reviews
     */
    getLimitedReviews: (state) => (limit: number): GoogleReview[] => {
      return state.reviews.slice(0, limit);
    },

    /**
     * Get reviews sorted by rating (highest first)
     * 
     * @param {ReviewsState} state - Current store state
     * @returns {GoogleReview[]} Sorted reviews array
     */
    getReviewsSortedByRating: (state): GoogleReview[] => {
      return [...state.reviews].sort((a, b) => b.rating - a.rating);
    },

    /**
     * Get reviews sorted by date (most recent first)
     * 
     * @param {ReviewsState} state - Current store state
     * @returns {GoogleReview[]} Sorted reviews array
     */
    getReviewsSortedByDate: (state): GoogleReview[] => {
      return [...state.reviews].sort((a, b) => b.time - a.time);
    },

    /**
     * Check if reviews are available
     * 
     * @param {ReviewsState} state - Current store state
     * @returns {boolean} True if reviews exist
     */
    hasReviews: (state): boolean => {
      return state.reviews.length > 0;
    },

    /**
     * Get total number of reviews
     * 
     * @param {ReviewsState} state - Current store state
     * @returns {number} Total review count
     */
    totalReviews: (state): number => {
      return state.reviews.length;
    },

    /**
     * Get average rating
     * 
     * @param {ReviewsState} state - Current store state
     * @returns {number} Average rating or 0 if no rating
     */
    averageRating: (state): number => {
      return state.aggregateRating?.rating || 0;
    }
  },

  /**
   * Store Actions
   */
  actions: {
    /**
     * Fetch reviews from server API
     * 
     * Retrieves reviews from the backend API endpoint which handles caching
     * and fallback logic. Updates store state based on response.
     * 
     * @param {boolean} force - Force refresh even if cache is valid
     * @returns {Promise<void>}
     */
    async fetchReviews(force: boolean = false): Promise<void> {
      // Skip if cache is fresh and not forcing refresh
      if (!force && this.isCacheFresh) {
        // eslint-disable-next-line no-console
        console.log('[Reviews Store] Using cached reviews');
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        // eslint-disable-next-line no-console
        console.log('[Reviews Store] Fetching reviews from API');

        // Fetch from server API endpoint
        const response = await $fetch<{
          reviews: GoogleReview[];
          aggregateRating: AggregateRating;
          source: string;
          warning?: string;
          error?: string;
        }>('/api/reviews/google');

        // Log the source of the data
        // eslint-disable-next-line no-console
        console.log(`[Reviews Store] Received ${response.reviews.length} reviews from ${response.source}`);

        // Update state
        this.reviews = response.reviews;
        this.aggregateRating = response.aggregateRating;
        this.lastFetched = Date.now();

        // Log warnings if present
        if (response.warning) {
          // eslint-disable-next-line no-console
          console.warn('[Reviews Store]', response.warning);
        }

        if (response.error) {
          // eslint-disable-next-line no-console
          console.error('[Reviews Store] API returned error:', response.error);
        }

      } catch (err) {
        // Handle fetch errors
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reviews';
        this.error = errorMessage;
        
        // eslint-disable-next-line no-console
        console.error('[Reviews Store] Error fetching reviews:', err);

        // Keep existing data if available (graceful degradation)
        if (this.reviews.length === 0) {
          // If no cached data, the API should have returned fallback reviews
          // But if we're here, something went very wrong
          throw new Error('Unable to load reviews. Please try again later.');
        }
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear cached reviews and force refresh
     * 
     * Resets the store state and fetches fresh data from the API.
     * 
     * @returns {Promise<void>}
     */
    async refreshReviews(): Promise<void> {
      this.lastFetched = null;
      await this.fetchReviews(true);
    },

    /**
     * Reset store to initial state
     * 
     * Clears all reviews, ratings, and error states.
     */
    resetStore(): void {
      this.reviews = [];
      this.aggregateRating = null;
      this.loading = false;
      this.error = null;
      this.lastFetched = null;
    }
  }
});
