<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary via-primary to-steel-blue text-white py-20">
      <div class="container-custom">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Construction Insights & Updates
          </h1>
          <p class="text-lg text-white/90 leading-relaxed">
            Expert tips, project updates, and industry insights from Thapa Construction. 
            Stay informed about the latest in construction, design, and materials.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16">
      <div class="container-custom">
        <!-- Search and Filter Bar -->
        <div class="bg-secondary rounded-lg p-6 mb-12 shadow-sm">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search Input -->
            <div class="flex-1">
              <div class="relative">
                <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral/50" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search articles by title, description, or category..."
                  class="w-full pl-10 pr-4 py-3 rounded-md border border-neutral/20 focus:border-steel-blue focus:ring focus:ring-steel-blue/20 transition duration-300"
                  @input="handleSearch"
                />
              </div>
            </div>

            <!-- Category Filter -->
            <div class="lg:w-64">
              <select
                v-model="selectedCategory"
                class="w-full px-4 py-3 rounded-md border border-neutral/20 focus:border-steel-blue focus:ring focus:ring-steel-blue/20 transition duration-300"
                @change="handleCategoryChange"
              >
                <option value="all">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Sort By -->
            <div class="lg:w-48">
              <select
                v-model="sortBy"
                class="w-full px-4 py-3 rounded-md border border-neutral/20 focus:border-steel-blue focus:ring focus:ring-steel-blue/20 transition duration-300"
                @change="handleSortChange"
              >
                <option value="date">Latest First</option>
                <option value="views">Most Viewed</option>
                <option value="title">A-Z</option>
              </select>
            </div>
          </div>

          <!-- Active Filters Display -->
          <div v-if="selectedCategory !== 'all' || searchQuery" class="flex items-center gap-2 mt-4 flex-wrap">
            <span class="text-sm font-medium text-neutral">Active filters:</span>
            
            <button
              v-if="selectedCategory !== 'all'"
              @click="clearCategoryFilter"
              class="px-3 py-1 bg-accent text-primary rounded-full text-sm font-medium flex items-center gap-1 hover:bg-accent/80 transition-colors"
            >
              {{ selectedCategory }}
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>

            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="px-3 py-1 bg-accent text-primary rounded-full text-sm font-medium flex items-center gap-1 hover:bg-accent/80 transition-colors"
            >
              "{{ searchQuery }}"
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>

            <button
              @click="clearAllFilters"
              class="px-3 py-1 text-steel-blue text-sm font-medium hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="flex items-center justify-between mb-8">
          <p class="text-neutral">
            <span class="font-semibold text-primary">{{ filteredBlogs.length }}</span> 
            {{ filteredBlogs.length === 1 ? 'article' : 'articles' }} found
          </p>
          
          <!-- Quick Category Pills -->
          <div class="hidden md:flex items-center gap-2">
            <button
              @click="selectedCategory = 'all'; handleCategoryChange()"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                selectedCategory === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-neutral hover:bg-primary/10'
              ]"
            >
              All
            </button>
            <button
              v-for="category in categories.slice(0, 3)"
              :key="category"
              @click="selectedCategory = category; handleCategoryChange()"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                selectedCategory === category 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-neutral hover:bg-primary/10'
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <!-- Blog Grid -->
        <div v-if="filteredBlogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <BlogCard
            v-for="blog in filteredBlogs"
            :key="blog.id"
            :blog="blog"
            :show-views="true"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <Icon name="heroicons:document-magnifying-glass" class="w-20 h-20 text-neutral/30 mx-auto mb-4" />
          <h3 class="text-2xl font-semibold text-primary mb-2">No articles found</h3>
          <p class="text-neutral mb-6">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            @click="clearAllFilters"
            class="btn-primary"
          >
            Clear Filters
          </button>
        </div>

        <!-- Featured Articles Section (if filters are not active) -->
        <div v-if="!isFilterActive && featuredBlogs.length > 0" class="mt-20">
          <div class="text-center mb-12">
            <h2 class="section-title mx-auto after:mx-auto">Featured Articles</h2>
            <p class="text-neutral mt-2">
              Must-read articles handpicked by our experts
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard
              v-for="blog in featuredBlogs.slice(0, 3)"
              :key="blog.id"
              :blog="blog"
              :show-views="true"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-secondary">
      <div class="container-custom text-center">
        <h2 class="text-3xl font-bold text-primary mb-4">
          Have Questions About Construction?
        </h2>
        <p class="text-neutral mb-8 max-w-2xl mx-auto">
          Our team is here to help. Contact us for expert advice on your next construction project.
        </p>
        <NuxtLink to="/contact" class="btn-primary">
          Get in Touch
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Blog Listing Page
 * 
 * Displays all blog posts with:
 * - Search functionality
 * - Category filtering
 * - Sort options (date, views, title)
 * - Responsive grid layout
 * - Featured articles section
 * - Empty state handling
 */

import { useBlogStore } from '~/stores/blog';
import type { BlogCategory } from '~/types/blog';

// SEO Configuration
useHead({
  title: 'Blog - Construction Tips & Insights | Thapa Construction',
  meta: [
    {
      name: 'description',
      content: 'Read expert construction tips, project updates, and industry insights from Thapa Construction. Stay informed about the latest in construction, design, materials, and safety.'
    },
    {
      name: 'keywords',
      content: 'construction blog, building tips, design ideas, construction materials, project updates, Darjeeling construction, safety guidelines'
    }
  ]
});

// Store
const blogStore = useBlogStore();

// Reactive state
const searchQuery = ref('');
const selectedCategory = ref<BlogCategory | 'all'>('all');
const sortBy = ref<'date' | 'views' | 'title'>('date');

// Computed properties
const categories = computed(() => blogStore.categories);
const filteredBlogs = computed(() => blogStore.filteredBlogs);
const featuredBlogs = computed(() => blogStore.featuredBlogs);

const isFilterActive = computed(() => {
  return selectedCategory.value !== 'all' || searchQuery.value !== '';
});

// Methods
const handleSearch = () => {
  blogStore.setFilters({ searchQuery: searchQuery.value });
};

const handleCategoryChange = () => {
  blogStore.setFilters({ 
    category: selectedCategory.value 
  });
};

const handleSortChange = () => {
  blogStore.setFilters({ sortBy: sortBy.value });
};

const clearSearch = () => {
  searchQuery.value = '';
  handleSearch();
};

const clearCategoryFilter = () => {
  selectedCategory.value = 'all';
  handleCategoryChange();
};

const clearAllFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  sortBy.value = 'date';
  blogStore.resetFilters();
};

// Initialize filters on mount
onMounted(() => {
  blogStore.resetFilters();
});
</script>

<style scoped>
/* Custom animations for smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
