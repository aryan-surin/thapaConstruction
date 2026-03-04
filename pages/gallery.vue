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
              v-for="(item, index) in galleryStore.allItems"
              :key="item.id"
              class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white cursor-pointer"
              @click="openPreview(index)"
            >
              <!-- Image Container with Aspect Ratio -->
              <div class="relative aspect-[4/3] overflow-hidden">
                <img
                  :src="getImageUrl(item.image_url)"
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

    <!-- Image Preview Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="previewIndex !== null"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          @click.self="closePreview"
        >
          <!-- Close Button -->
          <button
            @click="closePreview"
            class="absolute top-4 right-4 md:top-8 md:right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 backdrop-blur-md"
            aria-label="Close preview"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>

          <!-- Image Counter -->
          <div class="absolute top-4 left-4 md:top-8 md:left-8 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
            {{ previewIndex + 1 }} / {{ galleryStore.allItems.length }}
          </div>

          <!-- Previous Button -->
          <button
            v-if="previewIndex > 0"
            @click="previousImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 backdrop-blur-md hover:scale-110"
            aria-label="Previous image"
          >
            <Icon name="heroicons:chevron-left" class="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <!-- Next Button -->
          <button
            v-if="previewIndex < galleryStore.allItems.length - 1"
            @click="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 backdrop-blur-md hover:scale-110"
            aria-label="Next image"
          >
            <Icon name="heroicons:chevron-right" class="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <!-- Image Container -->
          <div class="w-full h-full flex flex-col items-center justify-center p-4 md:p-16">
            <Transition name="image-fade" mode="out-in">
              <div v-if="currentPreviewItem" :key="previewIndex" class="max-w-7xl max-h-full flex flex-col items-center">
                <!-- Image -->
                <img
                  :src="getImageUrl(currentPreviewItem.image_url)"
                  :alt="currentPreviewItem.alt_text"
                  class="max-w-full max-h-[70vh] md:max-h-[75vh] object-contain rounded-lg shadow-2xl"
                  @error="handleImageError"
                />
                
                <!-- Caption Area -->
                <div v-if="currentPreviewItem.alt_text || currentPreviewItem.caption" class="mt-6 max-w-3xl text-center px-4">
                  <h3 class="text-white text-lg md:text-xl font-semibold mb-2">{{ currentPreviewItem.alt_text }}</h3>
                  <p v-if="currentPreviewItem.caption" class="text-white/80 text-sm md:text-base">{{ currentPreviewItem.caption }}</p>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>

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
import { useGalleryStore } from '~/stores/gallery'

/**
 * Public Gallery Page
 * 
 * Customer-facing gallery displaying curated images from projects and standalone uploads.
 * Features lazy loading, responsive grid, image preview modal with navigation.
 * 
 * Data source: gallery_items table via Supabase
 * Ordering: sort_order ASC, created_at ASC (enforced in store)
 * Max items: 30 (enforced server-side)
 */

const galleryStore = useGalleryStore()

// Image preview state
const previewIndex = ref<number | null>(null)

/**
 * Get current preview item
 */
const currentPreviewItem = computed(() => {
  if (previewIndex.value === null) return null
  return galleryStore.allItems[previewIndex.value]
})

/**
 * Normalize image URLs (handles relative paths and absolute Supabase URLs)
 */
const getImageUrl = (url: string): string => {
  if (!url) return ''
  // If already absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // If relative path, ensure it's properly formatted
  return url.startsWith('/') ? url : `/${url}`
}

/**
 * Open image preview at specific index
 */
const openPreview = (index: number): void => {
  previewIndex.value = index
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden'
}

/**
 * Close image preview
 */
const closePreview = (): void => {
  previewIndex.value = null
  // Restore body scroll
  document.body.style.overflow = ''
}

/**
 * Navigate to previous image
 */
const previousImage = (): void => {
  if (previewIndex.value !== null && previewIndex.value > 0) {
    previewIndex.value--
  }
}

/**
 * Navigate to next image
 */
const nextImage = (): void => {
  if (previewIndex.value !== null && previewIndex.value < galleryStore.allItems.length - 1) {
    previewIndex.value++
  }
}

/**
 * Handle keyboard navigation
 */
const handleKeydown = (event: KeyboardEvent): void => {
  if (previewIndex.value === null) return
  
  switch (event.key) {
    case 'Escape':
      closePreview()
      break
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

/**
 * Fetch gallery items on component mount
 */
onMounted(async () => {
  await galleryStore.fetchGalleryItems()
  // Add keyboard event listener
  window.addEventListener('keydown', handleKeydown)
})

/**
 * Cleanup on component unmount
 */
onUnmounted(() => {
  // Remove keyboard event listener
  window.removeEventListener('keydown', handleKeydown)
  // Restore body scroll if modal was open
  document.body.style.overflow = ''
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

/* Modal transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Image transitions */
.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.image-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.image-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
