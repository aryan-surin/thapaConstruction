<template>
  <section :class="['py-20', backgroundClass]">
    <div class="container-custom">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="section-title mx-auto after:mx-auto">{{ title }}</h2>
        <p class="text-neutral">
          {{ description }}
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="max-w-4xl mx-auto">
        <div 
          v-for="(faq, index) in displayedFAQs" 
          :key="index" 
          class="mb-4 border border-neutral/10 rounded-lg overflow-hidden"
          :itemscope="withSchema" 
          :itemtype="withSchema ? 'https://schema.org/Question' : undefined"
        >
          <!-- Question Button -->
          <button 
            class="w-full px-6 py-4 bg-white text-left flex justify-between items-center text-primary font-medium hover:bg-secondary transition-colors duration-300"
            :aria-expanded="activeFAQ === index"
            :aria-controls="`faq-answer-${index}`"
            @click="toggleFAQ(index)"
          >
            <span :itemprop="withSchema ? 'name' : undefined">{{ faq.question }}</span>
            <Icon 
              :name="activeFAQ === index ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
              class="w-5 h-5 transition-transform duration-300 flex-shrink-0 ml-4"
              aria-hidden="true"
            />
          </button>
          
          <!-- Answer Content -->
          <div 
            v-show="activeFAQ === index"
            :id="`faq-answer-${index}`"
            class="px-6 py-4 bg-white border-t border-neutral/10 text-neutral"
            :itemscope="withSchema" 
            :itemtype="withSchema ? 'https://schema.org/Answer' : undefined"
            role="region"
            :aria-labelledby="`faq-question-${index}`"
          >
            <p :itemprop="withSchema ? 'text' : undefined">{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Optional CTA Link -->
      <div v-if="showMoreLink && moreLink" class="text-center mt-12">
        <NuxtLink :to="moreLink" class="btn-outline">
          {{ moreLinkText }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FAQ } from '~/data/faqs';

/**
 * FAQSection Component
 * 
 * Reusable FAQ accordion section component for displaying Frequently Asked Questions.
 * Supports customizable title, description, FAQ list, limiting, and styling.
 * Includes accessibility features (ARIA attributes) and optional SEO schema markup.
 * 
 * @component
 * @example
 * <FAQSection 
 *   :faqs="allFAQs" 
 *   :limit="4"
 *   title="Got Questions?" 
 *   background-class="bg-white"
 * />
 */

/**
 * Component Props
 */
interface Props {
  /**
   * Array of FAQ objects to display
   * @type {FAQ[]}
   * @required
   */
  faqs: FAQ[];

  /**
   * Section title
   * @type {string}
   * @default 'Frequently Asked Questions'
   */
  title?: string;

  /**
   * Section description text
   * @type {string}
   * @default 'Find answers to common questions about our construction services below.'
   */
  description?: string;

  /**
   * Background CSS class (e.g., 'bg-white', 'bg-secondary', 'bg-primary')
   * @type {string}
   * @default 'bg-white'
   */
  backgroundClass?: string;

  /**
   * Maximum number of FAQs to display. If not set, shows all FAQs.
   * @type {number | undefined}
   */
  limit?: number;

  /**
   * Whether to include FAQ schema markup for SEO
   * @type {boolean}
   * @default true
   */
  withSchema?: boolean;

  /**
   * Show a "View More" link at the bottom
   * @type {boolean}
   * @default false
   */
  showMoreLink?: boolean;

  /**
   * URL for the "View More" link
   * @type {string}
   * @default '/contact#faqs'
   */
  moreLink?: string;

  /**
   * Text for the "View More" link
   * @type {string}
   * @default 'View All FAQs'
   */
  moreLinkText?: string;
}

/**
 * Props with defaults
 */
const props = withDefaults(defineProps<Props>(), {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about our construction services below.',
  backgroundClass: 'bg-white',
  limit: undefined,
  withSchema: true,
  showMoreLink: false,
  moreLink: '/contact#faqs',
  moreLinkText: 'View All FAQs'
});

/**
 * Currently active (expanded) FAQ index
 * @type {Ref<number | null>}
 */
const activeFAQ = ref<number | null>(null);

/**
 * Computed: FAQs to display (respects limit prop)
 * 
 * @returns {FAQ[]} Array of FAQs to render
 */
const displayedFAQs = computed(() => {
  if (props.limit && props.limit > 0) {
    return props.faqs.slice(0, props.limit);
  }
  return props.faqs;
});

/**
 * Toggle FAQ accordion open/close
 * 
 * If clicking an already-open FAQ, it closes.
 * If clicking a closed FAQ, it opens (and closes any other open FAQ).
 * 
 * @param {number} index - The index of the FAQ to toggle
 */
const toggleFAQ = (index: number): void => {
  // Close if already open, otherwise open the clicked FAQ
  activeFAQ.value = activeFAQ.value === index ? null : index;
  
  // Logging for debugging/monitoring
  // eslint-disable-next-line no-console
  console.log(`FAQ ${index} toggled:`, activeFAQ.value === index ? 'opened' : 'closed');
};
</script>

<style scoped>
/**
 * Custom styles for FAQ accordion
 * 
 * - Smooth transitions for accordion open/close
 * - Focus styles for accessibility
 * - Hover effects for interactive elements
 */

button:focus {
  outline: 2px solid theme('colors.accent');
  outline-offset: 2px;
}

/* Smooth slide animation for answers */
[role="region"] {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
