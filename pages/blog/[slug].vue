<template>
  <div v-if="blog" class="min-h-screen bg-white">
    <!-- Hero Section with Cover Image -->
    <section class="relative h-[60vh] min-h-[400px] overflow-hidden">
      <!-- Background Image -->
      <img 
        :src="blog.coverImage" 
        :alt="blog.title"
        class="absolute inset-0 w-full h-full object-cover"
        @error="handleImageError"
      />
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
      
      <!-- Content -->
      <div class="relative h-full container-custom flex items-end pb-12">
        <div class="max-w-4xl text-white">
          <!-- Category Badge -->
          <div class="inline-block px-4 py-2 bg-accent text-primary rounded-full text-sm font-semibold mb-4">
            {{ blog.category }}
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {{ blog.title }}
          </h1>

          <!-- Meta Information -->
          <div class="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
            <div class="flex items-center gap-2">
              <Icon name="heroicons:user-circle" class="w-5 h-5" />
              <span class="font-medium">{{ blog.author }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:calendar" class="w-5 h-5" />
              <time :datetime="blog.publishedAt.toISOString()">
                {{ formatDate(blog.publishedAt) }}
              </time>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:clock" class="w-5 h-5" />
              <span>{{ blog.readingTime }} min read</span>
            </div>
            <div v-if="blog.views" class="flex items-center gap-2">
              <Icon name="heroicons:eye" class="w-5 h-5" />
              <span>{{ blog.views }} views</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Breadcrumb Navigation -->
    <section class="bg-secondary border-b border-neutral/10">
      <div class="container-custom py-4">
        <nav class="flex items-center gap-2 text-sm">
          <NuxtLink to="/" class="text-neutral hover:text-steel-blue transition-colors">
            Home
          </NuxtLink>
          <Icon name="heroicons:chevron-right" class="w-4 h-4 text-neutral/50" />
          <NuxtLink to="/blog" class="text-neutral hover:text-steel-blue transition-colors">
            Blog
          </NuxtLink>
          <Icon name="heroicons:chevron-right" class="w-4 h-4 text-neutral/50" />
          <span class="text-primary font-medium truncate">{{ blog.title }}</span>
        </nav>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <!-- Article Content -->
          <article class="prose prose-lg max-w-none mb-16">
            <!-- Description/Lead -->
            <p class="text-xl text-neutral leading-relaxed font-medium mb-8">
              {{ blog.description }}
            </p>

            <!-- Main Content (HTML) - Sanitized for XSS protection -->
            <div v-html="sanitizedContent" class="blog-content"></div>

            <!-- Updated Date (if exists) -->
            <div v-if="blog.updatedAt" class="mt-12 pt-6 border-t border-neutral/10 text-sm text-neutral/70 italic">
              Last updated: {{ formatDate(blog.updatedAt) }}
            </div>
          </article>

          <!-- Share Section -->
          <div class="bg-secondary rounded-lg p-6 mb-12">
            <h3 class="text-lg font-semibold text-primary mb-4">Share this article</h3>
            <div class="flex flex-wrap gap-3">
              <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                <Icon name="logos:facebook" class="w-5 h-5" />
                Facebook
              </a>
              <a
                :href="`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(blog.title)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                <Icon name="logos:twitter" class="w-5 h-5" />
                Twitter
              </a>
              <a
                :href="`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-md hover:opacity-90 transition-opacity"
              >
                <Icon name="logos:linkedin-icon" class="w-5 h-5" />
                LinkedIn
              </a>
              <button
                @click="copyLink"
                class="flex items-center gap-2 px-4 py-2 bg-neutral text-white rounded-md hover:opacity-90 transition-opacity"
              >
                <Icon name="heroicons:link" class="w-5 h-5" />
                {{ linkCopied ? 'Copied!' : 'Copy Link' }}
              </button>
            </div>
          </div>

          <!-- Author Box -->
          <div class="bg-accent/10 rounded-lg p-8 mb-12 border border-accent/20">
            <div class="flex items-start gap-4">
              <div class="w-20 h-20 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <Icon name="heroicons:building-office-2" class="w-10 h-10 text-primary" />
              </div>
              <div>
                <h4 class="text-xl font-bold text-primary mb-2">{{ blog.author }}</h4>
                <p class="text-neutral leading-relaxed">
                  Thapa Construction is a leading construction company in Darjeeling, West Bengal, 
                  specializing in residential and commercial projects. With years of experience, 
                  we deliver quality craftsmanship and exceptional service.
                </p>
                <NuxtLink to="/about" class="inline-flex items-center gap-1 text-steel-blue font-semibold mt-3 hover:gap-2 transition-all">
                  Learn more about us
                  <Icon name="heroicons:arrow-right" class="w-4 h-4" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Navigation (Previous/Next) -->
          <div class="flex flex-col md:flex-row gap-4 mb-12">
            <NuxtLink
              v-if="previousBlog"
              :to="`/blog/${previousBlog.slug}`"
              class="flex-1 group bg-secondary hover:bg-primary p-6 rounded-lg transition-colors duration-300"
            >
              <div class="flex items-center gap-3 mb-2 text-neutral group-hover:text-white">
                <Icon name="heroicons:arrow-left" class="w-5 h-5" />
                <span class="text-sm font-medium">Previous Article</span>
              </div>
              <h4 class="font-semibold text-primary group-hover:text-white line-clamp-2">
                {{ previousBlog.title }}
              </h4>
            </NuxtLink>

            <NuxtLink
              v-if="nextBlog"
              :to="`/blog/${nextBlog.slug}`"
              class="flex-1 group bg-secondary hover:bg-primary p-6 rounded-lg transition-colors duration-300 text-right"
            >
              <div class="flex items-center justify-end gap-3 mb-2 text-neutral group-hover:text-white">
                <span class="text-sm font-medium">Next Article</span>
                <Icon name="heroicons:arrow-right" class="w-5 h-5" />
              </div>
              <h4 class="font-semibold text-primary group-hover:text-white line-clamp-2">
                {{ nextBlog.title }}
              </h4>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Articles -->
    <section v-if="relatedBlogs.length > 0" class="py-20 bg-secondary">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="section-title mx-auto after:mx-auto">Related Articles</h2>
          <p class="text-neutral mt-2">
            Continue reading more articles in {{ blog.category }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <BlogCard
            v-for="relatedBlog in relatedBlogs.slice(0, 3)"
            :key="relatedBlog.id"
            :blog="relatedBlog"
          />
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/blog" class="btn-primary">
            View All Articles
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your Project?
        </h2>
        <p class="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
          Let's bring your construction vision to life. Contact us today for a free consultation.
        </p>
        <NuxtLink to="/contact" class="btn bg-accent text-primary hover:bg-white hover:text-primary">
          Get Free Quote
        </NuxtLink>
      </div>
    </section>
  </div>

  <!-- 404 State -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center">
    <div class="container-custom text-center py-20">
      <Icon name="heroicons:document-magnifying-glass" class="w-32 h-32 text-neutral/20 mx-auto mb-6" />
      <h1 class="text-4xl font-bold text-primary mb-4">Article Not Found</h1>
      <p class="text-neutral mb-8 text-lg">
        Sorry, we couldn't find the article you're looking for.
      </p>
      <div class="flex gap-4 justify-center">
        <NuxtLink to="/blog" class="btn-primary">
          Browse All Articles
        </NuxtLink>
        <NuxtLink to="/" class="btn-outline">
          Go Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Blog Detail Page
 * 
 * Displays a single blog post with:
 * - Hero section with cover image
 * - Full article content
 * - Author information
 * - Social sharing
 * - Related articles
 * - Previous/Next navigation
 */

import { useBlogStore } from '~/stores/blog';
import type { BlogPost } from '~/types/blog';
import { sanitizeHtml } from '~/utils/sanitize';

const route = useRoute();
const blogStore = useBlogStore();
const config = useRuntimeConfig();

// Get blog slug from route
const slug = route.params.slug as string;

// Get blog post
const blog = computed(() => blogStore.getBlogBySlug(slug));

/**
 * Sanitize blog content to prevent XSS attacks
 * Content is sanitized on the client side before rendering
 */
const sanitizedContent = computed(() => {
  if (!blog.value?.content) return '';
  return sanitizeHtml(blog.value.content);
});

// Get related blogs (same category, excluding current)
const relatedBlogs = computed(() => {
  if (!blog.value) return [];
  return blogStore.getBlogsByCategory(blog.value.category)
    .filter((b: BlogPost) => b.id !== blog.value?.id)
    .slice(0, 3);
});

// Get all blogs for navigation
const allBlogs = computed(() => blogStore.allBlogs);

// Get previous and next blog
const currentIndex = computed(() => 
  allBlogs.value.findIndex((b: BlogPost) => b.id === blog.value?.id)
);

const previousBlog = computed(() => {
  if (currentIndex.value > 0) {
    return allBlogs.value[currentIndex.value - 1];
  }
  return null;
});

const nextBlog = computed(() => {
  if (currentIndex.value < allBlogs.value.length - 1) {
    return allBlogs.value[currentIndex.value + 1];
  }
  return null;
});

// Share URL
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return encodeURIComponent(window.location.href);
  }
  return encodeURIComponent(`${config.public.siteUrl}/blog/${slug}`);
});

// Link copied state
const linkCopied = ref(false);

// SEO Configuration
useHead(() => ({
  title: blog.value 
    ? `${blog.value.title} | Thapa Construction Blog`
    : 'Article Not Found | Thapa Construction',
  meta: blog.value ? [
    {
      name: 'description',
      content: blog.value.description
    },
    {
      name: 'keywords',
      content: `${blog.value.category}, construction, Darjeeling, ${blog.value.title}`
    },
    // Open Graph
    {
      property: 'og:title',
      content: blog.value.title
    },
    {
      property: 'og:description',
      content: blog.value.description
    },
    {
      property: 'og:image',
      content: blog.value.coverImage
    },
    {
      property: 'og:type',
      content: 'article'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: blog.value.title
    },
    {
      name: 'twitter:description',
      content: blog.value.description
    },
    {
      name: 'twitter:image',
      content: blog.value.coverImage
    }
  ] : []
}));

// Methods
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/images/blog/placeholder.jpg';
};

const copyLink = async () => {
  if (typeof window !== 'undefined') {
    try {
      await navigator.clipboard.writeText(window.location.href);
      linkCopied.value = true;
      setTimeout(() => {
        linkCopied.value = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }
};

// Increment view count on mount
onMounted(() => {
  if (blog.value) {
    blogStore.incrementViews(slug);
  }
});

// Scroll to top on route change
watch(() => route.params.slug, () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
</script>

<style scoped>
/**
 * Blog content styling
 * Ensures proper formatting of HTML content
 */
.blog-content :deep(h2) {
  @apply text-2xl md:text-3xl font-bold text-primary mt-8 mb-4;
}

.blog-content :deep(h3) {
  @apply text-xl md:text-2xl font-semibold text-primary mt-6 mb-3;
}

.blog-content :deep(p) {
  @apply text-neutral leading-relaxed mb-4;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  @apply ml-6 mb-4 space-y-2;
}

.blog-content :deep(li) {
  @apply text-neutral leading-relaxed;
}

.blog-content :deep(ul li) {
  @apply list-disc;
}

.blog-content :deep(ol li) {
  @apply list-decimal;
}

.blog-content :deep(blockquote) {
  @apply border-l-4 border-accent pl-6 py-4 my-6 bg-secondary rounded-r-lg;
}

.blog-content :deep(blockquote p) {
  @apply text-primary font-medium italic mb-0;
}

.blog-content :deep(strong) {
  @apply font-semibold text-primary;
}

.blog-content :deep(.lead) {
  @apply text-xl text-neutral/90 font-normal leading-relaxed;
}

.blog-content :deep(a) {
  @apply text-steel-blue hover:underline;
}

.blog-content :deep(img) {
  @apply rounded-lg shadow-md my-6;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
