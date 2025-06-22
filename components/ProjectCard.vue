<template>
  <div class="group relative overflow-hidden rounded-lg shadow-md bg-white">
    <!-- Image -->
    <div class="relative h-72 overflow-hidden">
      <img 
        :src="image" 
        :alt="title" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-primary/10 group-hover:bg-primary/40 transition-opacity duration-300"></div>
      
      <!-- Hover Overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <NuxtLink :to="link" class="bg-accent text-primary px-6 py-3 rounded-md font-semibold transform hover:scale-105 transition-transform duration-300">
          View Project
        </NuxtLink>
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-6">
      <div class="flex justify-between items-center mb-2">
        <div class="px-3 py-1 text-xs font-semibold bg-secondary text-primary rounded-full">
          {{ category }}
        </div>
        <div class="text-sm text-neutral/80">{{ location }}</div>
      </div>
      <h3 class="text-xl font-semibold mb-2 text-primary group-hover:text-steel-blue transition-colors duration-300">{{ title }}</h3>
      <p class="text-neutral line-clamp-2">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  location: string;
  image: string;
  link: string;
}

defineProps<ProjectCardProps>();
</script>
