<template>
  <section class="w-full py-12 md:py-16">
    <div class="container-custom">
      <!-- Certifications Grid -->
      <div 
        class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
        :class="{ 'fade-in-up': mounted }"
      >
        <!-- GST Registered -->
        <div 
          class="certification-item flex items-center gap-4 group"
          @mouseenter="hoveredItem = 'gst'"
          @mouseleave="hoveredItem = null"
        >
          <div class="certification-icon">
            <!-- Document/Receipt Icon -->
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="w-8 h-8 transition-transform duration-300"
              :class="{ 'scale-110': hoveredItem === 'gst' }"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <div>
            <p 
              class="text-base md:text-lg font-semibold text-slate-700 transition-colors duration-300"
              :class="{ 'text-slate-900': hoveredItem === 'gst' }"
            >
              GST Registered
            </p>
          </div>
        </div>

        <!-- Vertical Separator (Desktop) -->
        <div class="hidden md:block w-px h-12 bg-slate-200"></div>

        <!-- Licensed Contractor -->
        <div 
          class="certification-item flex items-center gap-4 group"
          @mouseenter="hoveredItem = 'license'"
          @mouseleave="hoveredItem = null"
        >
          <div class="certification-icon">
            <!-- Shield Check Icon -->
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="w-8 h-8 transition-transform duration-300"
              :class="{ 'scale-110': hoveredItem === 'license' }"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" 
              />
            </svg>
          </div>
          <div>
            <p 
              class="text-base md:text-lg font-semibold text-slate-700 transition-colors duration-300"
              :class="{ 'text-slate-900': hoveredItem === 'license' }"
            >
              Licensed Contractor
            </p>
          </div>
        </div>

        <!-- Vertical Separator (Desktop) -->
        <div class="hidden md:block w-px h-12 bg-slate-200"></div>

        <!-- MSME Certified -->
        <div 
          class="certification-item flex items-center gap-4 group"
          @mouseenter="hoveredItem = 'msme'"
          @mouseleave="hoveredItem = null"
        >
          <div class="certification-icon">
            <!-- Building/Office Icon -->
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="w-8 h-8 transition-transform duration-300"
              :class="{ 'scale-110': hoveredItem === 'msme' }"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" 
              />
            </svg>
          </div>
          <div>
            <p 
              class="text-base md:text-lg font-semibold text-slate-700 transition-colors duration-300"
              :class="{ 'text-slate-900': hoveredItem === 'msme' }"
            >
              MSME Certified
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * Certifications Component
 * 
 * Displays professional certifications and trust indicators for the construction company.
 * 
 * Features:
 * - Minimal, premium design that doesn't clutter the interface
 * - Horizontal layout on desktop, vertical stack on mobile
 * - Gold outline icons with dark text
 * - Subtle fade-in animation on mount
 * - Minimal hover effect (slight scale only)
 * - Transparent background with subtle separators
 * 
 * Certifications Displayed:
 * - GST Registered
 * - Licensed Contractor (Trade License)
 * - MSME Certified (Udyam Registered)
 * 
 * Design Philosophy:
 * - Lightweight and non-dominant visual presence
 * - Does not overpower surrounding content
 * - Maintains consistency with dark blue (#1e293b) and gold (#d4af37) palette
 */

// Refs for animation and interaction
const mounted = ref(false);
const hoveredItem = ref<string | null>(null);

// Lifecycle hooks
onMounted(() => {
  // Trigger fade-in animation after component mounts
  setTimeout(() => {
    mounted.value = true;
  }, 150);
});
</script>

<style scoped>
/**
 * Certification icon styling
 * Uses gold color for visual consistency with brand
 */
.certification-icon {
  color: #d4af37; /* Gold color for icons */
}

/**
 * Fade-in-up animation
 * Subtle entrance effect - 400ms duration
 */
.fade-in-up {
  animation: fadeInUp 400ms ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/**
 * Smooth transitions for all interactive elements
 */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
