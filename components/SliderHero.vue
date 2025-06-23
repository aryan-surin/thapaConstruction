<template>
  <div class="relative w-full h-[calc(100vh-80px)] overflow-hidden">
    <!-- Slides -->
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute w-full h-full transition-opacity duration-1000 ease-in-out"
      :class="{ 'opacity-100': index === activeSlide, 'opacity-0': index !== activeSlide }"
    >
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${slide.image})` }"
      ></div>
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          {{ slide.quote }}
        </h1>
        <p class="text-accent text-xl md:text-2xl font-semibold mb-8 uppercase tracking-wider text-shadow">
          Thapa Construction
        </p>
        <div>
          <NuxtLink
            to="/services"
            class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Our Services
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="ml-4 bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-white hover:text-primary"
          >
            Contact Us
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      @click="prevSlide"
      class="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 bg-white bg-opacity-25 hover:bg-opacity-50 rounded-full p-2 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      @click="nextSlide"
      class="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 bg-white bg-opacity-25 hover:bg-opacity-50 rounded-full p-2 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">

// Define the structure of a slide
interface Slide {
  image: string;
  quote: string;
}

// Slides data
const slides: Slide[] = [
  {
    image: '/images/hero-home.jpg',
    quote: 'The best way to predict the future is to create it.',
  },
  {
    image: '/images/about-home.jpg',
    quote: 'Quality is not an act, it is a habit.',
  },
  {
    image: '/images/about-story.jpg',
    quote: 'We shape our buildings; thereafter they shape us.',
  },
  {
    image: '/images/why-choose-us.jpg',
    quote: 'The sun never knew how great it was until it hit the side of a building.',
  },
];

// Reactive state for the active slide
const activeSlide = ref(0);
let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Moves to the next slide.
 * Resets to the first slide if it's the last one.
 */
const nextSlide = (): void => {
  activeSlide.value = (activeSlide.value + 1) % slides.length;
};

/**
 * Moves to the previous slide.
 * Resets to the last slide if it's the first one.
 */
const prevSlide = (): void => {
  activeSlide.value = (activeSlide.value - 1 + slides.length) % slides.length;
};

/**
 * Starts the autoplay functionality.
 */
const startAutoplay = (): void => {
  intervalId = setInterval(() => {
    nextSlide();
  }, 5000); // Change slide every 5 seconds
};

/**
 * Stops the autoplay functionality.
 */
const stopAutoplay = (): void => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// Lifecycle hooks
onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
/* Custom styles can be added here if needed */
.bg-primary-dark {
    background-color: #004b7d; /* A darker shade of the primary color for hover effect */
}
.text-shadow {
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}
</style>
