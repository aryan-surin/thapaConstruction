<template>
  <section class="relative w-full h-[calc(100vh-80px)] min-h-[600px] overflow-hidden">
    <!-- Video Background - Hidden on mobile -->
    <div 
      v-if="shouldShowVideo" 
      class="absolute inset-0 w-full h-full hidden md:block"
    >
      <!-- WebM Source (preferred for performance) -->
      <video
        ref="videoElement"
        class="absolute inset-0 w-full h-full object-cover"
        playsinline
        muted
        loop
        autoplay
        disablePictureInPicture
        preload="none"
        @canplay="onVideoReady"
        @error="onVideoError"
      >
        <source :src="videoWebmSrc" type="video/webm" />
        <source :src="videoMp4Src" type="video/mp4" />
      </video>
    </div>

    <!-- Fallback Image (for mobile and video error) -->
    <div 
      class="absolute inset-0 w-full h-full"
      :class="{ 'md:hidden': shouldShowVideo && !videoError }"
    >
      <img 
        src="/images/hero-video-fallback.jpg" 
        alt="Thapa Construction - Professional Building Services"
        class="w-full h-full object-cover"
        loading="eager"
      />
    </div>

    <!-- Dark Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-[#1e293b]/95 via-[#1e293b]/85 to-[#1e293b]/70"></div>

    <!-- Hero Content -->
    <div class="relative z-10 h-full">
      <div class="container-custom h-full flex items-center">
        <div class="max-w-3xl" :class="{ 'fade-in': mounted }">
          
          <!-- Main Headline -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            From Blueprint to Reality —<br />
            <span class="text-accent">Built to Last</span>
          </h1>

          <!-- Subheading - Services -->
          <p class="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
            Expert construction services for residential homes, commercial buildings, 
            and complete renovations across Darjeeling and Jalpiguri districts.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 mb-12">
            <NuxtLink
              to="/contact"
              class="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-accent text-[#1e293b]  rounded-lg transition-all duration-300 hover:bg-[#e8c455] hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Get Free Quote
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
            
            <NuxtLink
              to="/projects"
              class="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/80 rounded-lg transition-all duration-300 hover:bg-white hover:text-[#1e293b] hover:border-white hover:shadow-lg"
            >
              View Projects
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </NuxtLink>
          </div>

          <!-- Trust Indicators -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 text-white/90">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-accent">50+</p>
                <p class="text-sm text-gray-300">Projects Completed</p>
              </div>
            </div>

            <div class="hidden sm:block w-px h-12 bg-white/20"></div>

            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-accent">2+</p>
                <p class="text-sm text-gray-300">Years Experience</p>
              </div>
            </div>

            <div class="hidden sm:block w-px h-12 bg-white/20"></div>

            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p class="text-2xl font-bold text-accent">50+</p>
                <p class="text-sm text-gray-300">Happy Clients</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * VideoHero Component
 * 
 * A modern hero section with video background optimized for performance.
 * 
 * Features:
 * - Full-width video background with WebM/MP4 fallback
 * - Mobile-responsive (video disabled on screens < 768px)
 * - Fallback image for mobile and video errors
 * - Dark gradient overlay for content readability
 * - Left-aligned layout with clear CTAs
 * - Trust indicators with business stats
 * - Fade-in animation on mount
 * - Performance optimized with lazy loading
 * 
 * Performance Considerations:
 * - Video preload set to "none" to avoid blocking page load
 * - Conditional rendering prevents video download on mobile
 * - Error handling with automatic fallback to image
 * - Picture-in-picture disabled to reduce memory usage
 */

// Refs
const videoElement = ref<HTMLVideoElement | null>(null);
const mounted = ref(false);
const videoError = ref(false);
const shouldShowVideo = ref(false);

// Video source paths (using computed to avoid Vite build-time resolution)
const videoWebmSrc = computed(() => '/videos/construction-hero.webm');
const videoMp4Src = computed(() => '/videos/construction-hero.mp4');

/**
 * Check if device is likely to handle video well
 * Only show video on desktop (>=768px) and when not on slow connection
 */
const checkVideoSupport = (): boolean => {
  // Check if running on client side
  if (typeof window === 'undefined') {
    return false;
  }

  // Check screen size (desktop only)
  if (window.innerWidth < 768) {
    return false;
  }

  // Check connection speed if available (avoid video on slow connections)
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection && (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      return false;
    }
  }

  return true;
};

/**
 * Handle video ready state
 * Start playback when video is ready
 */
const onVideoReady = (): void => {
  if (videoElement.value) {
    videoElement.value.play().catch((error: Error) => {
      console.warn('Video autoplay failed:', error);
      videoError.value = true;
    });
  }
};

/**
 * Handle video loading errors
 * Fallback to image if video fails
 */
const onVideoError = (): void => {
  console.warn('Video failed to load, using fallback image');
  videoError.value = true;
};

// Lifecycle hooks
onMounted(() => {
  // Check if video should be loaded
  shouldShowVideo.value = checkVideoSupport();

  // Trigger fade-in animation
  setTimeout(() => {
    mounted.value = true;
  }, 100);

  // Attempt to play video after mount
  if (shouldShowVideo.value && videoElement.value) {
    setTimeout(() => {
      videoElement.value?.play().catch((error: Error) => {
        console.warn('Video autoplay failed:', error);
        videoError.value = true;
      });
    }, 500);
  }
});

onUnmounted(() => {
  // Clean up video element
  if (videoElement.value) {
    videoElement.value.pause();
    videoElement.value.src = '';
    videoElement.value.load();
  }
});
</script>

<style scoped>
/**
 * Fade-in animation for hero content
 * Duration: 400ms for subtle, professional effect
 */
.fade-in {
  animation: fadeIn 400ms ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/**
 * Accent color override
 * Uses specified gold color (#d4af37)
 */
.text-accent {
  color: #d4af37;
}

.bg-accent {
  background-color: #d4af37;
  color: #1e293b; /* Dark blue text on gold background for readability */
}

/**
 * Smooth video rendering
 * Prevents flickering and improves performance
 */
video {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

/**
 * Ensure smooth transitions
 */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
