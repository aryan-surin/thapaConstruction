<template>
  <section :class="['py-20', backgroundClass]">
    <div class="container-custom">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <!-- Title -->
        <h2 class="section-title mx-auto after:mx-auto mb-4">{{ title }}</h2>
        
        <!-- Description -->
        <p class="text-neutral mb-6">
          {{ description }}
        </p>

        <!-- Aggregate Rating Badge -->
        <div v-if="showRating && aggregateRating" class="flex justify-center">
          <GoogleRatingBadge 
            :rating="aggregateRating.rating"
            :total-reviews="aggregateRating.user_ratings_total"
            show-google-logo
            show-count
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="n in (limit || 3)" 
          :key="n"
          class="bg-white p-6 rounded-lg shadow-md animate-pulse"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-gray-200"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div class="flex gap-1 mb-3">
            <div v-for="i in 5" :key="i" class="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-200 rounded"></div>
            <div class="h-3 bg-gray-200 rounded"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-primary mb-2">Unable to Load Reviews</h3>
        <p class="text-neutral mb-6">{{ error }}</p>
        <button 
          @click="retryFetch"
          class="btn-outline"
        >
          Try Again
        </button>
      </div>

      <!-- Reviews Grid -->
      <div 
        v-else-if="displayedReviews.length > 0" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <GoogleReviewCard 
          v-for="review in displayedReviews"
          :key="review.id"
          :review="review"
          :show-reply="showReplies"
          :with-schema="withSchema"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-16 h-16 text-neutral/30 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-primary mb-2">No Reviews Yet</h3>
        <p class="text-neutral">Be the first to share your experience!</p>
      </div>

      <!-- Call-to-Action Button -->
      <div v-if="showCta && googleBusinessUrl" class="text-center mt-12">
        <a 
          :href="googleBusinessUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary inline-flex items-center gap-2"
          @click="handleCtaClick"
        >
          <Icon name="heroicons:star" class="w-5 h-5" />
          {{ ctaText }}
        </a>
      </div>

      <!-- Schema Markup for Aggregate Rating -->
      <div 
        v-if="withSchema && aggregateRating"
        itemscope 
        itemtype="https://schema.org/LocalBusiness"
        class="hidden"
      >
        <meta itemprop="name" content="Thapa Construction">
        <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
          <meta itemprop="ratingValue" :content="aggregateRating.rating.toString()">
          <meta itemprop="reviewCount" :content="aggregateRating.total_reviews.toString()">
          <meta itemprop="bestRating" content="5">
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useReviewsStore } from '~/stores/reviews';
import type { GoogleReview, AggregateRating } from '~/types/reviews';

/**
 * Google Reviews Section Component
 * 
 * Main component for displaying Google Reviews with aggregate rating,
 * loading states, error handling, and CTA to leave reviews.
 * 
 * @component
 * @example
 * <GoogleReviewsSection 
 *   :limit="4"
 *   title="What Our Clients Say"
 *   show-rating
 *   show-cta
 * />
 */

/**
 * Component Props
 */
interface Props {
  /**
   * Maximum number of reviews to display
   * @type {number}
   * @default undefined (show all)
   */
  limit?: number;

  /**
   * Section title
   * @type {string}
   * @default 'Google Reviews'
   */
  title?: string;

  /**
   * Section description
   * @type {string}
   * @default 'See what our clients are saying about us on Google.'
   */
  description?: string;

  /**
   * Background CSS class
   * @type {string}
   * @default 'bg-secondary'
   */
  backgroundClass?: string;

  /**
   * Show aggregate rating badge
   * @type {boolean}
   * @default true
   */
  showRating?: boolean;

  /**
   * Show "Leave a Review" CTA button
   * @type {boolean}
   * @default true
   */
  showCta?: boolean;

  /**
   * CTA button text
   * @type {string}
   * @default 'Leave a Review'
   */
  ctaText?: string;

  /**
   * Include SEO schema markup
   * @type {boolean}
   * @default true
   */
  withSchema?: boolean;

  /**
   * Minimum rating to display (1-5)
   * @type {number}
   * @default 1 (show all)
   */
  minRating?: number;

  /**
   * Show business replies to reviews
   * @type {boolean}
   * @default true
   */
  showReplies?: boolean;
}

/**
 * Props with defaults
 */
const props = withDefaults(defineProps<Props>(), {
  limit: undefined,
  title: 'Google Reviews',
  description: 'See what our clients are saying about us on Google.',
  backgroundClass: 'bg-secondary',
  showRating: true,
  showCta: true,
  ctaText: 'Leave a Review',
  withSchema: true,
  minRating: 1,
  showReplies: true
});

/**
 * Reviews store instance
 */
const reviewsStore = useReviewsStore();

/**
 * Google Business Profile URL
 * Using the share link provided
 */
const googleBusinessUrl = 'https://g.page/r/YOUR_PLACE_ID/review'; // TODO: Update with actual review URL

/**
 * Fetch reviews on component mount
 */
onMounted(async () => {
  await reviewsStore.fetchReviews();
});

/**
 * Computed: Filtered and limited reviews
 */
const displayedReviews = computed((): GoogleReview[] => {
  let reviews = reviewsStore.reviews;

  // Filter by minimum rating
  if (props.minRating > 1) {
    reviews = reviews.filter(review => review.rating >= props.minRating);
  }

  // Sort by rating (highest first) then by date (most recent)
  reviews = reviews.sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return b.time - a.time;
  });

  // Limit number of reviews
  if (props.limit) {
    reviews = reviews.slice(0, props.limit);
  }

  return reviews;
});

/**
 * Computed: Aggregate rating data
 */
const aggregateRating = computed((): AggregateRating | null => {
  return reviewsStore.aggregateRating;
});

/**
 * Computed: Loading state
 */
const loading = computed((): boolean => {
  return reviewsStore.loading;
});

/**
 * Computed: Error state
 */
const error = computed((): string | null => {
  return reviewsStore.error;
});

/**
 * Retry fetching reviews
 */
const retryFetch = async (): Promise<void> => {
  await reviewsStore.refreshReviews();
};

/**
 * Handle CTA button click
 * Logs analytics event
 */
const handleCtaClick = (): void => {
  // eslint-disable-next-line no-console
  console.log('[Google Reviews] Leave a Review CTA clicked');
  
  // TODO: Add analytics tracking here
  // Example: window.gtag('event', 'click', { event_category: 'reviews', event_label: 'leave_review' });
};
</script>

<style scoped>
/**
 * Component styles
 * 
 * Animation for loading skeleton and smooth transitions
 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
