<template>
  <div class="min-h-screen bg-secondary py-8">
    <div class="container-custom">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-primary mb-2">Manage Blog Posts</h1>
            <p class="text-neutral">Create, edit, and manage your blog articles</p>
          </div>
          <NuxtLink to="/admin/blog/create" class="btn-primary">
            <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
            New Blog Post
          </NuxtLink>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-neutral text-sm mb-1">Total Articles</p>
              <p class="text-3xl font-bold text-primary">{{ totalBlogs }}</p>
            </div>
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:document-text" class="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-neutral text-sm mb-1">Featured</p>
              <p class="text-3xl font-bold text-accent">{{ featuredCount }}</p>
            </div>
            <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:star" class="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-neutral text-sm mb-1">Total Views</p>
              <p class="text-3xl font-bold text-steel-blue">{{ totalViews }}</p>
            </div>
            <div class="w-12 h-12 bg-steel-blue/10 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:eye" class="w-6 h-6 text-steel-blue" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-neutral text-sm mb-1">Categories</p>
              <p class="text-3xl font-bold text-success">{{ categories.length }}</p>
            </div>
            <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:folder" class="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title or description..."
              class="form-input"
            />
          </div>
          <div class="md:w-48">
            <select v-model="filterCategory" class="form-input">
              <option value="all">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Blog Posts Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Table Header -->
        <div class="px-6 py-4 border-b border-neutral/10 bg-secondary">
          <h2 class="text-lg font-semibold text-primary">All Blog Posts</h2>
        </div>

        <!-- Table Content -->
        <div v-if="filteredBlogs.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-secondary/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                  Article
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                  Published
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                  Views
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-neutral uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-neutral uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral/10">
              <tr v-for="blog in filteredBlogs" :key="blog.id" class="hover:bg-secondary/30 transition-colors">
                <!-- Article Info -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <img 
                      :src="blog.coverImage" 
                      :alt="blog.title"
                      class="w-20 h-14 object-cover rounded"
                      @error="handleImageError"
                    />
                    <div class="max-w-md">
                      <NuxtLink 
                        :to="`/blog/${blog.slug}`"
                        target="_blank"
                        class="font-semibold text-primary hover:text-steel-blue line-clamp-1"
                      >
                        {{ blog.title }}
                      </NuxtLink>
                      <p class="text-sm text-neutral line-clamp-1">{{ blog.description }}</p>
                    </div>
                  </div>
                </td>

                <!-- Category -->
                <td class="px-6 py-4">
                  <span class="px-3 py-1 text-xs font-medium bg-accent/20 text-primary rounded-full">
                    {{ blog.category }}
                  </span>
                </td>

                <!-- Published Date -->
                <td class="px-6 py-4 text-sm text-neutral">
                  {{ formatDate(blog.publishedAt) }}
                </td>

                <!-- Views -->
                <td class="px-6 py-4 text-sm text-neutral">
                  <div class="flex items-center gap-1">
                    <Icon name="heroicons:eye" class="w-4 h-4" />
                    {{ blog.views || 0 }}
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <button
                    @click="toggleFeatured(blog.id)"
                    :class="[
                      'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      blog.featured 
                        ? 'bg-success/20 text-success hover:bg-success/30' 
                        : 'bg-neutral/10 text-neutral hover:bg-neutral/20'
                    ]"
                  >
                    <Icon 
                      :name="blog.featured ? 'heroicons:star-solid' : 'heroicons:star'" 
                      class="w-3 h-3"
                    />
                    {{ blog.featured ? 'Featured' : 'Standard' }}
                  </button>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <NuxtLink
                      :to="`/blog/${blog.slug}`"
                      target="_blank"
                      class="p-2 text-steel-blue hover:bg-steel-blue/10 rounded transition-colors"
                      title="View"
                    >
                      <Icon name="heroicons:eye" class="w-5 h-5" />
                    </NuxtLink>
                    <button
                      @click="handleDelete(blog)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Icon name="heroicons:trash" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="px-6 py-20 text-center">
          <Icon name="heroicons:document-text" class="w-16 h-16 text-neutral/20 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-primary mb-2">No blog posts found</h3>
          <p class="text-neutral mb-6">
            {{ searchQuery || filterCategory !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Get started by creating your first blog post' 
            }}
          </p>
          <NuxtLink to="/admin/blog/create" class="btn-primary">
            <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
            Create Blog Post
          </NuxtLink>
        </div>
      </div>

      <!-- Back to Dashboard -->
      <div class="mt-8">
        <NuxtLink to="/admin" class="inline-flex items-center text-steel-blue hover:text-primary transition-colors">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
          Back to Dashboard
        </NuxtLink>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        <div class="flex items-start gap-4 mb-6">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-primary mb-2">Delete Blog Post</h3>
            <p class="text-neutral">
              Are you sure you want to delete "<strong>{{ blogToDelete?.title }}</strong>"? 
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div class="flex gap-3 justify-end">
          <button
            @click="cancelDelete"
            class="px-4 py-2 border border-neutral/20 text-neutral rounded-md hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Admin Blog Management Page
 * 
 * Allows administrators to:
 * - View all blog posts in a table
 * - Search and filter blogs
 * - View statistics (total, featured, views)
 * - Toggle featured status
 * - Delete blog posts
 * - Navigate to create new blog
 * 
 * Protected by auth middleware
 */

import { useBlogStore } from '~/stores/blog';
import type { BlogPost } from '~/types/blog';

// Middleware to protect admin routes
definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

// SEO
useHead({
  title: 'Manage Blogs - Admin | Thapa Construction',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});

// Store
const blogStore = useBlogStore();

// Reactive state
const searchQuery = ref('');
const filterCategory = ref('all');
const showDeleteModal = ref(false);
const blogToDelete = ref<BlogPost | null>(null);

// Computed properties
const allBlogs = computed(() => blogStore.allBlogs);
const categories = computed(() => blogStore.categories);
const totalBlogs = computed(() => blogStore.totalBlogs);
const totalViews = computed(() => blogStore.totalViews);

const featuredCount = computed(() => {
  return allBlogs.value.filter((blog: BlogPost) => blog.featured).length;
});

const filteredBlogs = computed(() => {
  let filtered = [...allBlogs.value];

  // Filter by category
  if (filterCategory.value !== 'all') {
    filtered = filtered.filter(blog => blog.category === filterCategory.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(blog =>
      blog.title.toLowerCase().includes(query) ||
      blog.description.toLowerCase().includes(query)
    );
  }

  // Sort by published date (newest first)
  filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return filtered;
});

// Methods
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/blog/placeholder.jpg';
};

const toggleFeatured = (id: string) => {
  blogStore.toggleFeatured(id);
};

const handleDelete = (blog: BlogPost) => {
  blogToDelete.value = blog;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (blogToDelete.value) {
    const success = blogStore.deleteBlog(blogToDelete.value.id);
    if (success) {
      showDeleteModal.value = false;
      blogToDelete.value = null;
    }
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  blogToDelete.value = null;
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
