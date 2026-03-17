<template>
  <div class="min-h-screen bg-secondary py-8">
    <div class="container-custom max-w-5xl">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex items-center gap-4 mb-4">
          <NuxtLink 
            to="/admin/blog"
            class="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <Icon name="heroicons:arrow-left" class="w-6 h-6 text-neutral" />
          </NuxtLink>
          <div>
            <h1 class="text-3xl font-bold text-primary">Create New Blog Post</h1>
            <p class="text-neutral">Fill in the details below to publish a new article</p>
          </div>
        </div>
      </div>

      <!-- Blog Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Icon name="heroicons:document-text" class="w-6 h-6" />
            Basic Information
          </h2>

          <div class="space-y-6">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-semibold text-primary mb-2">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                placeholder="e.g., Essential Construction Safety Tips for 2026"
                class="form-input"
                required
                maxlength="200"
              />
              <p class="text-sm text-neutral/70 mt-1">
                {{ formData.title.length }}/200 characters
              </p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-semibold text-primary mb-2">
                Description/Excerpt <span class="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                placeholder="Brief summary of the article (150-200 characters recommended)"
                class="form-input"
                required
                maxlength="300"
              ></textarea>
              <p class="text-sm text-neutral/70 mt-1">
                {{ formData.description.length }}/300 characters
              </p>
            </div>

            <!-- Category -->
            <div>
              <label for="category" class="block text-sm font-semibold text-primary mb-2">
                Category <span class="text-red-500">*</span>
              </label>
              <select
                id="category"
                v-model="formData.category"
                class="form-input"
                required
              >
                <option value="" disabled>Select a category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Featured Toggle -->
            <div class="flex items-center gap-3">
              <input
                id="featured"
                v-model="formData.featured"
                type="checkbox"
                class="w-5 h-5 text-accent border-neutral/30 rounded focus:ring-accent"
              />
              <label for="featured" class="text-sm font-medium text-primary cursor-pointer">
                Mark as Featured Article
              </label>
            </div>
          </div>
        </div>

        <!-- Cover Image Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Icon name="heroicons:photo" class="w-6 h-6" />
            Cover Image
          </h2>

          <div class="space-y-6">
            <!-- Image Upload Options -->
            <div class="flex gap-4 mb-4">
              <button
                type="button"
                @click="imageUploadMethod = 'file'"
                :class="[
                  'flex-1 py-3 px-4 rounded-md font-medium transition-all',
                  imageUploadMethod === 'file'
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-neutral hover:bg-neutral/10'
                ]"
              >
                <Icon name="heroicons:arrow-up-tray" class="w-5 h-5 inline-block mr-2" />
                Upload File
              </button>
              <button
                type="button"
                @click="imageUploadMethod = 'url'"
                :class="[
                  'flex-1 py-3 px-4 rounded-md font-medium transition-all',
                  imageUploadMethod === 'url'
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-neutral hover:bg-neutral/10'
                ]"
              >
                <Icon name="heroicons:link" class="w-5 h-5 inline-block mr-2" />
                Image URL
              </button>
            </div>

            <!-- File Upload -->
            <div v-if="imageUploadMethod === 'file'">
              <label class="block">
                <span class="sr-only">Choose cover image</span>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="block w-full text-sm text-neutral file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-accent/80 cursor-pointer"
                />
              </label>
              <p class="text-sm text-neutral/70 mt-2">
                Recommended: 1200x600px (16:9 ratio), max 2MB
              </p>
            </div>

            <!-- URL Input -->
            <div v-else>
              <input
                v-model="formData.coverImage"
                type="url"
                placeholder="https://example.com/image.jpg"
                class="form-input"
                :required="!formData.coverImage"
              />
              <p class="text-sm text-neutral/70 mt-2">
                Enter a direct URL to an image (must start with http:// or https://)
              </p>
            </div>

            <!-- Image Preview -->
            <div v-if="formData.coverImage" class="mt-6">
              <p class="text-sm font-semibold text-primary mb-2">Preview:</p>
              <div class="relative rounded-lg overflow-hidden border border-neutral/20">
                <img
                  :src="formData.coverImage"
                  alt="Cover image preview"
                  class="w-full h-64 object-cover"
                  @error="handleImageError"
                />
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <Icon name="heroicons:x-mark" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Icon name="heroicons:document" class="w-6 h-6" />
            Article Content
          </h2>

          <div class="space-y-4">
            <!-- Content Editor Tabs -->
            <div class="flex gap-2 border-b border-neutral/20">
              <button
                type="button"
                @click="editorTab = 'write'"
                :class="[
                  'px-4 py-2 font-medium transition-colors border-b-2',
                  editorTab === 'write'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral hover:text-primary'
                ]"
              >
                Write
              </button>
              <button
                type="button"
                @click="editorTab = 'preview'"
                :class="[
                  'px-4 py-2 font-medium transition-colors border-b-2',
                  editorTab === 'preview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral hover:text-primary'
                ]"
              >
                Preview
              </button>
              <button
                type="button"
                @click="editorTab = 'guide'"
                :class="[
                  'px-4 py-2 font-medium transition-colors border-b-2',
                  editorTab === 'guide'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral hover:text-primary'
                ]"
              >
                HTML Guide
              </button>
            </div>

            <!-- Write Tab -->
            <div v-show="editorTab === 'write'">
              <textarea
                v-model="formData.content"
                rows="20"
                placeholder="Write your article content here. You can use HTML tags for formatting..."
                class="form-input font-mono text-sm"
                required
              ></textarea>
              <p class="text-sm text-neutral/70 mt-2">
                Words: {{ wordCount }} | Estimated reading time: {{ calculateReadingTime }} min
              </p>
            </div>

            <!-- Preview Tab -->
            <div v-show="editorTab === 'preview'" class="border border-neutral/20 rounded-lg p-6 min-h-[400px] bg-secondary/30">
              <div v-if="formData.content" v-html="formData.content" class="prose prose-lg max-w-none blog-content"></div>
              <div v-else class="text-center text-neutral py-20">
                <Icon name="heroicons:document-text" class="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Your content preview will appear here</p>
              </div>
            </div>

            <!-- HTML Guide Tab -->
            <div v-show="editorTab === 'guide'" class="border border-neutral/20 rounded-lg p-6 bg-secondary/30">
              <h3 class="font-semibold text-primary mb-4">HTML Formatting Guide</h3>
              <div class="space-y-4 text-sm">
                <div>
                  <p class="font-semibold text-primary mb-2">Headings:</p>
                  <code class="block bg-primary/5 p-2 rounded">&lt;h2&gt;Main Section Title&lt;/h2&gt;<br>&lt;h3&gt;Subsection Title&lt;/h3&gt;</code>
                </div>
                <div>
                  <p class="font-semibold text-primary mb-2">Paragraphs:</p>
                  <code class="block bg-primary/5 p-2 rounded">&lt;p&gt;Your paragraph text here.&lt;/p&gt;</code>
                </div>
                <div>
                  <p class="font-semibold text-primary mb-2">Lists:</p>
                  <code class="block bg-primary/5 p-2 rounded">&lt;ul&gt;<br>  &lt;li&gt;Item 1&lt;/li&gt;<br>  &lt;li&gt;Item 2&lt;/li&gt;<br>&lt;/ul&gt;</code>
                </div>
                <div>
                  <p class="font-semibold text-primary mb-2">Bold Text:</p>
                  <code class="block bg-primary/5 p-2 rounded">&lt;strong&gt;Bold text&lt;/strong&gt;</code>
                </div>
                <div>
                  <p class="font-semibold text-primary mb-2">Blockquote:</p>
                  <code class="block bg-primary/5 p-2 rounded">&lt;blockquote&gt;<br>  &lt;p&gt;Quote text&lt;/p&gt;<br>&lt;/blockquote&gt;</code>
                </div>
                <div>
                  <p class="font-semibold text-primary mb-2">Lead Paragraph (Intro):</p>
                  <code class="block bg-primary/5 p-2 rounded">&lt;p class="lead"&gt;Opening paragraph...&lt;/p&gt;</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div class="text-sm text-neutral">
              <span class="text-red-500">*</span> Required fields
            </div>
            <div class="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                @click="handleCancel"
                class="flex-1 sm:flex-none px-6 py-3 border border-neutral/20 text-neutral rounded-md hover:bg-secondary transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !isFormValid"
                :class="[
                  'flex-1 sm:flex-none px-6 py-3 rounded-md font-semibold transition-all',
                  isSubmitting || !isFormValid
                    ? 'bg-neutral/30 text-neutral/50 cursor-not-allowed'
                    : 'bg-accent text-primary hover:bg-primary hover:text-white'
                ]"
              >
                <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="w-5 h-5 inline-block mr-2 animate-spin" />
                {{ isSubmitting ? 'Publishing...' : 'Publish Blog Post' }}
              </button>
            </div>
          </div>
        </div>
      </form>

      <!-- Success Modal -->
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeSuccessModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-8 transform transition-all">
          <div class="text-center">
            <div class="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:check-circle" class="w-10 h-10 text-success" />
            </div>
            <h3 class="text-2xl font-bold text-primary mb-2">Blog Post Published!</h3>
            <p class="text-neutral mb-6">
              Your article has been successfully published and is now live.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <NuxtLink
                v-if="createdBlog"
                :to="`/blog/${createdBlog.slug}`"
                class="flex-1 btn bg-steel-blue text-white hover:bg-steel-blue/90"
              >
                View Article
              </NuxtLink>
              <button
                @click="createAnother"
                class="flex-1 btn-outline"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Blog Creation Form - Admin
 * 
 * Comprehensive blog post creation form with:
 * - Rich form inputs for title, description, category
 * - Image upload (file or URL)
 * - HTML content editor with preview
 * - Featured post toggle
 * - Form validation
 * - Success modal with navigation options
 * 
 * Protected by auth middleware
 */

import { useBlogStore } from '~/stores/blog';
import { BLOG_CATEGORIES, calculateReadingTime as calcReadTime } from '~/data/blogs';
import type { BlogFormInput, BlogPost } from '~/types/blog';

// Middleware to protect admin routes
definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

// SEO
useHead({
  title: 'Create Blog Post - Admin | Thapa Construction',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});

// Store
const blogStore = useBlogStore();
const router = useRouter();

// Reactive state
const formData = reactive<BlogFormInput>({
  title: '',
  description: '',
  coverImage: '',
  content: '',
  category: '' as any,
  featured: false
});

const imageUploadMethod = ref<'file' | 'url'>('url');
const editorTab = ref<'write' | 'preview' | 'guide'>('write');
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const createdBlog = ref<BlogPost | null>(null);

// Computed properties
const categories = computed(() => BLOG_CATEGORIES);

const wordCount = computed(() => {
  const text = formData.content.replace(/<[^>]*>/g, '');
  return text.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
});

const calculateReadingTime = computed(() => {
  return calcReadTime(formData.content);
});

const isFormValid = computed(() => {
  return (
    formData.title.trim().length > 0 &&
    formData.description.trim().length > 0 &&
    formData.coverImage.trim().length > 0 &&
    formData.content.trim().length > 0 &&
    formData.category.length > 0
  );
});

// Methods
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('Image size must be less than 2MB');
    return;
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file');
    return;
  }

  // Convert to base64
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.coverImage = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  formData.coverImage = '';
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/blog/placeholder.jpg';
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create blog post
    const newBlog = blogStore.createBlog(formData);

    if (newBlog) {
      createdBlog.value = newBlog;
      showSuccessModal.value = true;
    } else {
      alert('Failed to create blog post. Please try again.');
    }
  } catch (error) {
    console.error('Error creating blog:', error);
    alert('An error occurred. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
    router.push('/admin/blog');
  }
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  router.push('/admin/blog');
};

const createAnother = () => {
  showSuccessModal.value = false;
  createdBlog.value = null;
  
  // Reset form
  formData.title = '';
  formData.description = '';
  formData.coverImage = '';
  formData.content = '';
  formData.category = '' as any;
  formData.featured = false;
  
  editorTab.value = 'write';
  
  // Scroll to top
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<style scoped>
/**
 * Blog content preview styling
 */
.blog-content :deep(h2) {
  @apply text-2xl font-bold text-primary mt-6 mb-3;
}

.blog-content :deep(h3) {
  @apply text-xl font-semibold text-primary mt-4 mb-2;
}

.blog-content :deep(p) {
  @apply text-neutral leading-relaxed mb-4;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  @apply ml-6 mb-4 space-y-2;
}

.blog-content :deep(li) {
  @apply text-neutral;
}

.blog-content :deep(ul li) {
  @apply list-disc;
}

.blog-content :deep(ol li) {
  @apply list-decimal;
}

.blog-content :deep(blockquote) {
  @apply border-l-4 border-accent pl-4 py-2 my-4 bg-secondary/50 rounded-r;
}

.blog-content :deep(strong) {
  @apply font-semibold text-primary;
}

.blog-content :deep(.lead) {
  @apply text-xl text-neutral/90 font-normal;
}

code {
  @apply text-xs;
}
</style>
