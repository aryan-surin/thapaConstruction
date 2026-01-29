<template>
  <div class="min-h-screen bg-secondary">
    <!-- Hero Section -->
    <section class="bg-primary text-white py-20">
      <div class="container mx-auto max-w-7xl px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Our Gallery</h1>
        <p class="text-xl text-white/90 max-w-3xl mx-auto">
          Explore our curated collection of completed projects and featured work showcasing quality craftsmanship.
        </p>
      </div>
    </section>

    <!-- Gallery Grid -->
    <section class="py-16">
      <div class="container mx-auto max-w-7xl px-4">
        <!-- Loading State -->
        <div v-if="galleryStore.loading" class="text-center py-20">
          <Icon name="svg-spinners:270-ring" class="w-12 h-12 text-accent mx-auto mb-4" />
          <p class="text-neutral text-lg">Loading gallery...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="galleryStore.error" class="text-center py-20">
          <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-600 text-lg mb-4">{{ galleryStore.error }}</p>
          <button @click="refreshGallery" class="btn-primary">
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="galleryStore.totalCount === 0" class="text-center py-20">
          <Icon name="heroicons:photo" class="w-16 h-16 text-neutral/30 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-primary mb-2">No Gallery Items Yet</h2>
          <p class="text-neutral mb-6">Check back soon for our latest work!</p>
          <NuxtLink to="/projects" class="btn-primary">
            View Projects
          </NuxtLink>
        </div>

        <!-- Gallery Grid -->
        <div v-else>
          <!-- Stats Bar -->
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-neutral/20">
            <h2 class="text-2xl font-bold text-primary">
              {{ galleryStore.totalCount }} {{ galleryStore.totalCount === 1 ? 'Image' : 'Images' }}
            </h2>
            <div class="flex items-center space-x-4 text-sm text-neutral">
              <span class="flex items-center">
                <Icon name="heroicons:briefcase" class="w-4 h-4 mr-1 text-steel-blue" />
                {{ galleryStore.projectCount }} from projects
              </span>
              <span class="flex items-center">
                <Icon name="heroicons:star" class="w-4 h-4 mr-1 text-accent" />
                {{ galleryStore.standaloneCount }} featured
              </span>
            </div>
          </div>

          <!-- Responsive Masonry-style Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="item in galleryStore.allItems"
              :key="item.id"
              class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white"
            >
              <!-- Image Container with Aspect Ratio -->
              <div class="relative aspect-[4/3] overflow-hidden">
                <img
                  :src="item.image_url"
                  :alt="item.alt_text"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  @error="handleImageError"
                />
                
                <!-- Overlay on Hover -->
                <div class="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p class="text-white font-semibold text-sm mb-1">{{ item.alt_text }}</p>
                  <p v-if="item.caption" class="text-white/90 text-xs line-clamp-2">{{ item.caption }}</p>
                  
                  <!-- Source Badge -->
                  <span
                    class="absolute top-3 right-3 text-xs px-2 py-1 rounded"
                    :class="item.source_type === 'project' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-primary'"
                  >
                    {{ item.source_type === 'project' ? 'Project' : 'Featured' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('/images/cta-bg.jpg')"></div>
      <div class="container mx-auto max-w-7xl px-4 relative z-10 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Like What You See?</h2>
        <p class="text-white/90 text-lg max-w-3xl mx-auto mb-8">
          Let's bring your vision to life. Contact us today for a free consultation and quote.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/contact" class="btn bg-accent text-primary hover:bg-white transition-all duration-300">
            Get a Free Quote
          </NuxtLink>
          <NuxtLink to="/projects" class="btn bg-white/10 text-white border-2 border-white hover:bg-white hover:text-primary transition-all duration-300">
            View All Projects
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGalleryStore } from '~/stores/gallery'

/**
 * Public Gallery Page
 * 
 * Customer-facing gallery displaying curated images from projects and standalone uploads.
 * Features lazy loading, responsive grid, and performance optimizations.
 * 
 * Data source: gallery_items table via Supabase
 * Ordering: sort_order ASC, created_at ASC (enforced in store)
 * Max items: 30 (enforced server-side)
 */

const galleryStore = useGalleryStore()

/**
 * Fetch gallery items on component mount
 */
onMounted(async () => {
  await galleryStore.fetchGalleryItems()
})

/**
 * Refresh gallery on error/retry
 */
const refreshGallery = async (): Promise<void> => {
  await galleryStore.fetchGalleryItems()
}

/**
 * Handle image load errors gracefully
 * Replace broken images with placeholder
 */
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = '/images/placeholders/gallery-placeholder.jpg'
  target.alt = 'Image unavailable'
}

// SEO Metadata
useHead({
  title: 'Gallery - Thapa Construction',
  meta: [
    {
      name: 'description',
      content: 'Explore our gallery of completed construction projects, interior design work, and quality craftsmanship in Siliguri and surrounding areas.'
    },
    {
      name: 'keywords',
      content: 'construction gallery, project photos, interior design, carpentry, renovation photos, Siliguri construction'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Gallery - Thapa Construction'
    },
    {
      property: 'og:description',
      content: 'Explore our gallery of completed construction projects and quality craftsmanship.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})
</script>

<style scoped>
/* Smooth image loading animation */
img {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Line clamp for caption text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
