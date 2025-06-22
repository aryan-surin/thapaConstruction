<template>
  <section class="relative h-[85vh] min-h-[600px] bg-cover bg-center flex items-center overflow-hidden" :style="`background-image: url(${backgroundImage})`">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-primary/60"></div>
    
    <!-- Content -->
    <div class="container-custom relative z-10 text-white">
      <div class="max-w-3xl">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          <span class="block">{{ title }}</span>
          <span v-if="subtitle" class="text-accent">{{ subtitle }}</span>
        </h1>
        <p class="text-lg md:text-xl opacity-90 mb-8 max-w-2xl">
          {{ description }}
        </p>
        <div class="flex flex-wrap gap-4">
          <NuxtLink :to="primaryButtonLink" class="btn-primary">
            {{ primaryButtonText }}
          </NuxtLink>
          <NuxtLink v-if="secondaryButtonText" :to="secondaryButtonLink" class="btn border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
            {{ secondaryButtonText }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface HeroProps {
  backgroundImage: string;
  title: string;
  subtitle?: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

defineProps<HeroProps>();
</script>
