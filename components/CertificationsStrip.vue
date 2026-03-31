<template>
  <div class="w-full border-t border-slate-700/30 bg-slate-900/30 py-4">
    <div class="container-custom">
      <!-- Minimal Trust Strip -->
      <div class="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm">
        <!-- GST Registered -->
        <div class="flex items-center gap-2 text-slate-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="w-5 h-5 text-[#d4af37]" 
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
          <span>GST Registered</span>
        </div>

        <!-- Separator -->
        <span class="hidden md:inline-block text-slate-600">•</span>

        <!-- Licensed Contractor -->
        <div class="flex items-center gap-2 text-slate-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="w-5 h-5 text-[#d4af37]" 
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
          <span>Licensed Contractor</span>
        </div>

        <!-- Separator -->
        <span class="hidden md:inline-block text-slate-600">•</span>

        <!-- MSME Certified -->
        <div class="flex items-center gap-2 text-slate-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="w-5 h-5 text-[#d4af37]" 
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
          <span>MSME Certified</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * CertificationsStrip Component
 * 
 * Minimal trust strip version for footer display across all pages.
 * 
 * Features:
 * - Simplified, compact design suitable for footer
 * - Smaller icons (w-5 h-5)
 * - Horizontal layout with bullet separators
 * - Subtle styling that doesn't dominate footer
 * - No animations (static display)
 * - Dark background compatible
 * 
 * Design Philosophy:
 * - Minimal visual footprint
 * - Provides trust without being obtrusive
 * - Complements footer content
 */
</script>

<style scoped>
/**
 * No custom styles needed - uses Tailwind utilities only
 * Keeps component lightweight and maintainable
 */
</style>
