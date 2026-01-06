<template>
  <div :class="['inline-flex items-center gap-2 px-4 py-2 rounded-full', badgeClass]">
    <!-- Google Logo -->
    <svg 
      v-if="showGoogleLogo" 
      class="w-5 h-5" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>

    <!-- Star Icons -->
    <div class="flex items-center gap-0.5">
      <Icon 
        v-for="star in 5" 
        :key="star"
        :name="star <= Math.floor(rating) ? 'heroicons:star-solid' : 'heroicons:star'" 
        :class="[
          'w-4 h-4',
          star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        ]"
      />
    </div>

    <!-- Rating Text -->
    <span :class="['font-semibold', textClass]">
      {{ rating.toFixed(1) }}
    </span>

    <!-- Review Count -->
    <span v-if="showCount" :class="['text-sm', textClass]">
      ({{ totalReviews }})
    </span>
  </div>
</template>

<script setup lang="ts">
/**
 * Google Rating Badge Component
 * 
 * Displays aggregate Google rating with stars, score, and review count.
 * Can be used in headers, footers, or alongside review sections.
 * 
 * @component
 * @example
 * <GoogleRatingBadge 
 *   :rating="4.8" 
 *   :total-reviews="45"
 *   show-google-logo 
 * />
 */

/**
 * Component Props
 */
interface Props {
  /**
   * Average rating (1-5)
   * @type {number}
   * @required
   */
  rating: number;

  /**
   * Total number of reviews
   * @type {number}
   * @default 0
   */
  totalReviews?: number;

  /**
   * Show Google logo
   * @type {boolean}
   * @default true
   */
  showGoogleLogo?: boolean;

  /**
   * Show review count
   * @type {boolean}
   * @default true
   */
  showCount?: boolean;

  /**
   * Badge background style
   * @type {'light' | 'dark' | 'accent'}
   * @default 'light'
   */
  variant?: 'light' | 'dark' | 'accent';

  /**
   * Size variant
   * @type {'small' | 'medium' | 'large'}
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props with defaults
 */
const props = withDefaults(defineProps<Props>(), {
  totalReviews: 0,
  showGoogleLogo: true,
  showCount: true,
  variant: 'light',
  size: 'medium'
});

/**
 * Computed badge CSS class based on variant
 */
const badgeClass = computed(() => {
  switch (props.variant) {
    case 'dark':
      return 'bg-primary text-white';
    case 'accent':
      return 'bg-accent text-primary';
    case 'light':
    default:
      return 'bg-white border border-neutral/20 text-primary shadow-sm';
  }
});

/**
 * Computed text color class based on variant
 */
const textClass = computed(() => {
  return props.variant === 'dark' || props.variant === 'accent' 
    ? 'text-white' 
    : 'text-neutral';
});
</script>

<style scoped>
/**
 * Component styles
 * 
 * Ensures smooth animations and proper spacing
 */
.inline-flex {
  transition: all 0.2s ease;
}

.inline-flex:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
