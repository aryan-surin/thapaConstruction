import { defineStore } from 'pinia';
import type { BlogPost, BlogCategory, BlogFormInput, BlogFilterOptions } from '~/types/blog';
import { sampleBlogs, BLOG_CATEGORIES, generateSlug, calculateReadingTime } from '~/data/blogs';
import { sanitizeHtml, sanitizePlainText, validateHtmlSafety } from '~/utils/sanitize';

/**
 * Blog Store - Manages blog posts state
 * 
 * This Pinia store handles all blog-related state management including:
 * - Blog posts (initially loaded from sample data)
 * - CRUD operations (create, read, update, delete)
 * - Filtering and searching
 * - Category management
 * 
 * Note: All data is stored in memory (resets on page refresh)
 * For production, integrate with backend API or use localStorage for persistence
 */
export const useBlogStore = defineStore('blog', {
  state: () => ({
    /** Array of all blog posts */
    blogs: [...sampleBlogs] as BlogPost[],
    
    /** Loading state for async operations */
    loading: false,
    
    /** Error message if any operation fails */
    error: null as string | null,
    
    /** Current filter options */
    filters: {
      category: 'all' as BlogCategory | 'all',
      searchQuery: '',
      sortBy: 'date' as 'date' | 'views' | 'title',
      sortOrder: 'desc' as 'asc' | 'desc'
    } as BlogFilterOptions
  }),

  getters: {
    /**
     * Get all blog posts
     */
    allBlogs: (state): BlogPost[] => state.blogs,

    /**
     * Get available blog categories
     */
    categories: (): BlogCategory[] => BLOG_CATEGORIES,

    /**
     * Get featured blog posts
     */
    featuredBlogs: (state): BlogPost[] => {
      return state.blogs.filter(blog => blog.featured);
    },

    /**
     * Get filtered and sorted blog posts based on current filters
     */
    filteredBlogs: (state): BlogPost[] => {
      let filtered = [...state.blogs];

      // Filter by category
      if (state.filters.category && state.filters.category !== 'all') {
        filtered = filtered.filter(blog => blog.category === state.filters.category);
      }

      // Filter by search query
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase();
        filtered = filtered.filter(blog =>
          blog.title.toLowerCase().includes(query) ||
          blog.description.toLowerCase().includes(query) ||
          blog.category.toLowerCase().includes(query)
        );
      }

      // Sort blogs
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (state.filters.sortBy) {
          case 'date':
            comparison = b.publishedAt.getTime() - a.publishedAt.getTime();
            break;
          case 'views':
            comparison = (b.views || 0) - (a.views || 0);
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
        }

        return state.filters.sortOrder === 'asc' ? -comparison : comparison;
      });

      return filtered;
    },

    /**
     * Get recent blog posts (latest 5)
     */
    recentBlogs: (state): BlogPost[] => {
      return [...state.blogs]
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
        .slice(0, 5);
    },

    /**
     * Get blog post by slug
     */
    getBlogBySlug: (state) => {
      return (slug: string): BlogPost | undefined => {
        return state.blogs.find(blog => blog.slug === slug);
      };
    },

    /**
     * Get blogs by category
     */
    getBlogsByCategory: (state) => {
      return (category: BlogCategory): BlogPost[] => {
        return state.blogs.filter(blog => blog.category === category);
      };
    },

    /**
     * Get total blog count
     */
    totalBlogs: (state): number => state.blogs.length,

    /**
     * Get total views across all blogs
     */
    totalViews: (state): number => {
      return state.blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
    }
  },

  actions: {
    /**
     * Set filter options
     * @param filters - Filter options to apply
     */
    setFilters(filters: Partial<BlogFilterOptions>) {
      this.filters = { ...this.filters, ...filters };
    },

    /**
     * Reset filters to default
     */
    resetFilters() {
      this.filters = {
        category: 'all',
        searchQuery: '',
        sortBy: 'date',
        sortOrder: 'desc'
      };
    },

    /**
     * Create a new blog post
     * @param formData - Blog form input data
     * @returns Created blog post or null if error
     */
    createBlog(formData: BlogFormInput): BlogPost | null {
      try {
        this.loading = true;
        this.error = null;

        // Validate input data
        if (!formData.title?.trim()) {
          this.error = 'Title is required';
          return null;
        }

        if (!formData.description?.trim()) {
          this.error = 'Description is required';
          return null;
        }

        if (!formData.content?.trim()) {
          this.error = 'Content is required';
          return null;
        }

        if (!formData.category) {
          this.error = 'Category is required';
          return null;
        }

        // Validate HTML safety
        const contentSafety = validateHtmlSafety(formData.content);
        if (!contentSafety.isSafe) {
          this.error = `Content contains potentially dangerous HTML: ${contentSafety.issues.join(', ')}`;
          console.warn('Blog content safety issues:', contentSafety.issues);
          // Continue anyway but sanitize the content
        }

        // Generate unique ID
        const id = String(this.blogs.length + 1);
        
        // Sanitize text inputs
        const sanitizedTitle = sanitizePlainText(formData.title.trim());
        const sanitizedDescription = sanitizePlainText(formData.description.trim());
        
        // Generate slug from sanitized title
        const slug = generateSlug(sanitizedTitle);
        
        // Check if slug already exists
        if (this.blogs.some(blog => blog.slug === slug)) {
          this.error = 'A blog with this title already exists';
          return null;
        }

        // Sanitize HTML content to prevent XSS
        const sanitizedContent = sanitizeHtml(formData.content);

        // Calculate reading time from sanitized content
        const readingTime = calculateReadingTime(sanitizedContent);

        // Create new blog post with sanitized data
        const newBlog: BlogPost = {
          id,
          slug,
          title: sanitizedTitle,
          description: sanitizedDescription,
          coverImage: formData.coverImage, // Already validated as URL or base64
          content: sanitizedContent,
          category: formData.category,
          author: 'Thapa Construction',
          publishedAt: new Date(),
          readingTime,
          featured: formData.featured || false,
          views: 0
        };

        // Add to blogs array (prepend to show newest first)
        this.blogs.unshift(newBlog);

        return newBlog;
      } catch (err: any) {
        this.error = err.message || 'Failed to create blog post';
        console.error('Error creating blog:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update an existing blog post
     * @param id - Blog post ID
     * @param formData - Updated blog data
     * @returns Updated blog post or null if error
     */
    updateBlog(id: string, formData: Partial<BlogFormInput>): BlogPost | null {
      try {
        this.loading = true;
        this.error = null;

        const index = this.blogs.findIndex(blog => blog.id === id);
        
        if (index === -1) {
          this.error = 'Blog post not found';
          return null;
        }

        const existingBlog = this.blogs[index];

        // Validate and sanitize inputs if provided
        let sanitizedTitle = existingBlog.title;
        let sanitizedDescription = existingBlog.description;
        let sanitizedContent = existingBlog.content;
        
        if (formData.title) {
          if (!formData.title.trim()) {
            this.error = 'Title cannot be empty';
            return null;
          }
          sanitizedTitle = sanitizePlainText(formData.title.trim());
        }

        if (formData.description) {
          if (!formData.description.trim()) {
            this.error = 'Description cannot be empty';
            return null;
          }
          sanitizedDescription = sanitizePlainText(formData.description.trim());
        }

        if (formData.content) {
          if (!formData.content.trim()) {
            this.error = 'Content cannot be empty';
            return null;
          }
          
          // Validate HTML safety
          const contentSafety = validateHtmlSafety(formData.content);
          if (!contentSafety.isSafe) {
            console.warn('Blog content safety issues:', contentSafety.issues);
            // Continue anyway but sanitize the content
          }
          
          sanitizedContent = sanitizeHtml(formData.content);
        }

        // If title changed, regenerate slug
        let slug = existingBlog.slug;
        if (sanitizedTitle !== existingBlog.title) {
          slug = generateSlug(sanitizedTitle);
          
          // Check if new slug conflicts with another blog
          const conflict = this.blogs.find(blog => blog.slug === slug && blog.id !== id);
          if (conflict) {
            this.error = 'A blog with this title already exists';
            return null;
          }
        }

        // Recalculate reading time if content changed
        let readingTime = existingBlog.readingTime;
        if (sanitizedContent !== existingBlog.content) {
          readingTime = calculateReadingTime(sanitizedContent);
        }

        // Update blog post with sanitized data
        const updatedBlog: BlogPost = {
          ...existingBlog,
          title: sanitizedTitle,
          description: sanitizedDescription,
          content: sanitizedContent,
          slug,
          readingTime,
          category: formData.category || existingBlog.category,
          coverImage: formData.coverImage || existingBlog.coverImage,
          featured: formData.featured !== undefined ? formData.featured : existingBlog.featured,
          updatedAt: new Date()
        };

        this.blogs[index] = updatedBlog;

        return updatedBlog;
      } catch (err: any) {
        this.error = err.message || 'Failed to update blog post';
        console.error('Error updating blog:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete a blog post
     * @param id - Blog post ID to delete
     * @returns Success boolean
     */
    deleteBlog(id: string): boolean {
      try {
        this.loading = true;
        this.error = null;

        const index = this.blogs.findIndex(blog => blog.id === id);
        
        if (index === -1) {
          this.error = 'Blog post not found';
          return false;
        }

        this.blogs.splice(index, 1);
        return true;
      } catch (err: any) {
        this.error = err.message || 'Failed to delete blog post';
        console.error('Error deleting blog:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Increment view count for a blog post
     * @param slug - Blog post slug
     */
    incrementViews(slug: string) {
      const blog = this.blogs.find(b => b.slug === slug);
      if (blog) {
        blog.views = (blog.views || 0) + 1;
      }
    },

    /**
     * Toggle featured status for a blog post
     * @param id - Blog post ID
     */
    toggleFeatured(id: string) {
      const blog = this.blogs.find(b => b.id === id);
      if (blog) {
        blog.featured = !blog.featured;
      }
    }
  }
});
