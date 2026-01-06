<template>
  <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
    <!-- Review Header -->
    <div class="flex items-start justify-between mb-4">
      <!-- Author Info -->
      <div class="flex items-center gap-3">
        <!-- Author Photo -->
        <img 
          v-if="review.profile_photo_url"
          :src="review.profile_photo_url" 
          :alt="review.author_name"
          class="w-12 h-12 rounded-full object-cover border-2 border-accent/20"
          loading="lazy"
        />
        <div v-else class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="heroicons:user" class="w-6 h-6 text-primary" />
        </div>

        <div>
          <!-- Author Name -->
          <a 
            v-if="review.author_url"
            :href="review.author_url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="font-bold text-primary hover:text-accent transition-colors"
          >
            {{ review.author_name }}
          </a>
          <h4 v-else class="font-bold text-primary">
            {{ review.author_name }}
          </h4>

          <!-- Review Date -->
          <p class="text-sm text-neutral/70">
            {{ review.relative_time_description }}
          </p>
        </div>
      </div>

      <!-- Google Logo Badge (small) -->
      <div class="flex-shrink-0">
        <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </div>
    </div>

    <!-- Star Rating -->
    <div class="flex items-center gap-1 mb-3">
      <Icon 
        v-for="star in 5" 
        :key="star"
        :name="star <= review.rating ? 'heroicons:star-solid' : 'heroicons:star'" 
        :class="[
          'w-5 h-5',
          star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
        ]"
      />
    </div>

    <!-- Review Text -->
    <p 
      class="text-neutral leading-relaxed mb-4"
      :class="{ 'line-clamp-4': !expanded, 'whitespace-pre-wrap': expanded }"
    >
      {{ review.text }}
    </p>

    <!-- Expand/Collapse Button (if text is long) -->
    <button 
      v-if="review.text.length > 200"
      @click="expanded = !expanded"
      class="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
    >
      {{ expanded ? 'Show less' : 'Read more' }}
    </button>

    <!-- Business Reply (if exists) -->
    <div 
      v-if="review.reply && showReply" 
      class="mt-4 pt-4 border-t border-neutral/10 bg-accent/5 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg"
    >
      <div class="flex items-start gap-2 mb-2">
        <Icon name="heroicons:building-office" class="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <h5 class="font-semibold text-primary text-sm">Response from Thapa Construction</h5>
          <p class="text-xs text-neutral/70">
            {{ formatReplyDate(review.reply.time) }}
          </p>
        </div>
      </div>
      <p class="text-neutral text-sm leading-relaxed pl-7">
        {{ review.reply.comment }}
      </p>
    </div>

    <!-- Schema Markup for SEO -->
    <div 
      v-if="withSchema"
      itemscope 
      itemtype="https://schema.org/Review"
      class="hidden"
    >
      <div itemprop="author" itemscope itemtype="https://schema.org/Person">
        <meta itemprop="name" :content="review.author_name">
      </div>
      <div itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
        <meta itemprop="ratingValue" :content="review.rating.toString()">
        <meta itemprop="bestRating" content="5">
      </div>
      <meta itemprop="datePublished" :content="formatSchemaDate(review.time)">
      <div itemprop="reviewBody" :content="review.text"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GoogleReview } from '~/types/reviews';

/**
 * Google Review Card Component
 * 
 * Displays an individual Google review with author info, rating, text, and optional business reply.
 * Includes expand/collapse functionality for long reviews and SEO schema markup.
 * 
 * @component
 * @example
 * <GoogleReviewCard :review="reviewData" with-schema show-reply />
 */

/**
 * Component Props
 */
interface Props {
  /**
   * Review data object
   * @type {GoogleReview}
   * @required
   */
  review: GoogleReview;

  /**
   * Show business reply if available
   * @type {boolean}
   * @default true
   */
  showReply?: boolean;

  /**
   * Include SEO schema markup
   * @type {boolean}
   * @default true
   */
  withSchema?: boolean;
}

/**
 * Props with defaults
 */
const props = withDefaults(defineProps<Props>(), {
  showReply: true,
  withSchema: true
});

/**
 * Local state for expand/collapse
 */
const expanded = ref(false);

/**
 * Format reply timestamp to readable date
 * 
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date string
 */
const formatReplyDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Format timestamp to ISO 8601 for schema markup
 * 
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} ISO 8601 formatted date
 */
const formatSchemaDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toISOString();
};
</script>

<style scoped>
/**
 * Component styles
 * 
 * Line clamp utility and smooth transitions
 */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-shadow {
  transition: box-shadow 0.3s ease;
}
</style>
