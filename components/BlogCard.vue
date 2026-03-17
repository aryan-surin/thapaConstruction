<template>
  <article class="group relative overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-all duration-300">
    <!-- Cover Image -->
    <div class="relative h-64 overflow-hidden">
      <img 
        :src="blog.coverImage" 
        :alt="blog.title" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        @error="handleImageError"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
      
      <!-- Category Badge -->
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 text-xs font-semibold bg-accent text-primary rounded-full shadow-lg">
          {{ blog.category }}
        </span>
      </div>

      <!-- Hover Overlay - View Blog Button -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <NuxtLink 
          :to="`/blog/${blog.slug}`" 
          class="bg-accent text-primary px-6 py-3 rounded-md font-semibold transform hover:scale-105 transition-transform duration-300 shadow-lg"
        >
          Read Article
        </NuxtLink>
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-6">
      <!-- Meta Information -->
      <div class="flex items-center gap-4 mb-3 text-sm text-neutral/70">
        <div class="flex items-center gap-1">
          <Icon name="heroicons:calendar" class="w-4 h-4" />
          <time :datetime="blog.publishedAt.toISOString()">
            {{ formatDate(blog.publishedAt) }}
          </time>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="heroicons:clock" class="w-4 h-4" />
          <span>{{ blog.readingTime }} min read</span>
        </div>
        <div v-if="showViews && blog.views" class="flex items-center gap-1">
          <Icon name="heroicons:eye" class="w-4 h-4" />
          <span>{{ blog.views }}</span>
        </div>
      </div>

      <!-- Title -->
      <NuxtLink :to="`/blog/${blog.slug}`">
        <h3 class="text-xl font-bold mb-2 text-primary group-hover:text-steel-blue transition-colors duration-300 line-clamp-2">
          {{ blog.title }}
        </h3>
      </NuxtLink>

      <!-- Description -->
      <p class="text-neutral mb-4 line-clamp-3 leading-relaxed">
        {{ blog.description }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-secondary">
        <!-- Author -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Icon name="heroicons:building-office-2" class="w-5 h-5 text-primary" />
          </div>
          <span class="text-sm font-medium text-neutral">{{ blog.author }}</span>
        </div>

        <!-- Read More Link -->
        <NuxtLink 
          :to="`/blog/${blog.slug}`"
          class="text-steel-blue font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all duration-300"
        >
          Read More
          <Icon name="heroicons:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>

    <!-- Featured Badge (if featured) -->
    <div 
      v-if="blog.featured" 
      class="absolute top-4 right-4 bg-success text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
    >
      <Icon name="heroicons:star-solid" class="w-3 h-3" />
      Featured
    </div>
  </article>
</template>

<script setup lang="ts">
/**
 * BlogCard Component
 * 
 * Displays a blog post card with:
 * - Cover image with hover effects
 * - Category badge
 * - Title and description
 * - Meta information (date, reading time, views)
 * - Author information
 * - Read more link
 * 
 * Props:
 * - blog: Blog post object (required)
 * - showViews: Whether to display view count (optional, default: false)
 */

import type { BlogPost } from '~/types/blog';

interface BlogCardProps {
  blog: BlogPost;
  showViews?: boolean;
}

const props = defineProps<BlogCardProps>();

/**
 * Format date to readable format
 * @param date - Date object
 * @returns Formatted date string
 */
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Handle image load error by setting placeholder
 * @param event - Error event
 */
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/blog/placeholder.jpg';
};
</script>

<style scoped>
/**
 * Custom styles for line clamping (Tailwind's line-clamp utilities)
 * Ensures text truncation with ellipsis after specified lines
 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
