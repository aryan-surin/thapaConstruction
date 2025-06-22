<template>
  <div class="relative testimonial-carousel">
    <!-- Navigation Arrows -->
    <button 
      class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-accent text-primary p-3 rounded-full shadow-md -ml-4 hidden md:block"
      @click="prevSlide"
      aria-label="Previous testimonial"
    >
      <Icon name="heroicons:chevron-left" class="w-5 h-5" />
    </button>
    
    <div class="overflow-hidden">
      <div 
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div 
          v-for="(testimonial, index) in testimonials" 
          :key="index"
          class="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
        >
          <div class="bg-white p-8 rounded-lg shadow-md relative h-full">
            <div class="absolute -top-4 left-8 text-5xl text-accent opacity-50">"</div>
            <p class="italic text-neutral mb-6 relative z-10">{{ testimonial.content }}</p>
            <div class="flex items-center mt-auto">
              <img :src="testimonial.image" :alt="testimonial.name" class="w-12 h-12 rounded-full object-cover mr-4">
              <div>
                <h4 class="font-bold text-primary">{{ testimonial.name }}</h4>
                <p class="text-sm text-neutral">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <button 
      class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-accent text-primary p-3 rounded-full shadow-md -mr-4 hidden md:block"
      @click="nextSlide"
      aria-label="Next testimonial"
    >
      <Icon name="heroicons:chevron-right" class="w-5 h-5" />
    </button>

    <!-- Pagination Dots -->
    <div class="flex justify-center mt-8 space-x-2">
      <button 
        v-for="(_, index) in paginationDots" 
        :key="index"
        @click="goToSlide(index)"
        class="w-3 h-3 rounded-full transition-all duration-300"
        :class="index === currentSlide ? 'bg-accent scale-125' : 'bg-neutral/30 hover:bg-neutral/50'"
        :aria-label="`Go to testimonial ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

/**
 * Interface for testimonial data structure
 */
interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
}

/**
 * Props for the component
 */
interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  interval?: number;
  slidesPerView?: number;
}

/**
 * Define props with default values
 */
const props = withDefaults(defineProps<TestimonialsCarouselProps>(), {
  autoplay: true,
  interval: 5000,
  slidesPerView: 3
});

/**
 * Current slide index
 */
const currentSlide = ref(0);

/**
 * Calculate the effective slides per view based on screen size
 * This will be used to determine how many dots to show
 */
const effectiveSlidesPerView = computed(() => {
  // This is a simple approximation - in a real implementation,
  // you'd use window.innerWidth or a more sophisticated approach
  return props.slidesPerView;
});

/**
 * Calculate the number of pagination dots needed
 * This depends on the number of slides and the slides per view
 */
const paginationDots = computed(() => {
  const totalSlides = props.testimonials.length;
  const visibleSlides = effectiveSlidesPerView.value;
  
  // If we show 3 slides at once, we need fewer dots
  return Math.ceil(totalSlides / visibleSlides);
});

/**
 * Go to the previous slide
 */
const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else {
    // Loop to the end
    currentSlide.value = paginationDots.value - 1;
  }
};

/**
 * Go to the next slide
 */
const nextSlide = () => {
  if (currentSlide.value < paginationDots.value - 1) {
    currentSlide.value++;
  } else {
    // Loop to the beginning
    currentSlide.value = 0;
  }
};

/**
 * Go to a specific slide by index
 */
const goToSlide = (index: number) => {
  currentSlide.value = index;
};

/**
 * Autoplay functionality
 */
let autoplayInterval: number | null = null;

/**
 * Start the autoplay if enabled
 */
const startAutoplay = () => {
  if (props.autoplay && !autoplayInterval) {
    autoplayInterval = window.setInterval(() => {
      nextSlide();
    }, props.interval);
  }
};

/**
 * Stop the autoplay
 */
const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
};

/**
 * Lifecycle hooks
 */
onMounted(() => {
  startAutoplay();
  
  // Pause autoplay when user interacts with the carousel
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }
});

onUnmounted(() => {
  stopAutoplay();
  
  // Clean up event listeners
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    carousel.removeEventListener('mouseenter', stopAutoplay);
    carousel.removeEventListener('mouseleave', startAutoplay);
  }
});
</script>
