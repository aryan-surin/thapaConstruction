import { defineStore } from 'pinia';
import type { BlogPost, BlogCategory, BlogFormInput, BlogFilterOptions } from '~/types/blog';
import { sampleBlogs, BLOG_CATEGORIES, generateSlug, calculateReadingTime } from '~/data/blogs';

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

        // Generate unique ID
        const id = String(this.blogs.length + 1);
        
        // Generate slug from title
        const slug = generateSlug(formData.title);
        
        // Check if slug already exists
        if (this.blogs.some(blog => blog.slug === slug)) {
          this.error = 'A blog with this title already exists';
          return null;
        }

        // Calculate reading time
        const readingTime = calculateReadingTime(formData.content);

        // Create new blog post
        const newBlog: BlogPost = {
          id,
          slug,
          title: formData.title,
          description: formData.description,
          coverImage: formData.coverImage,
          content: formData.content,
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

        // If title changed, regenerate slug
        let slug = existingBlog.slug;
        if (formData.title && formData.title !== existingBlog.title) {
          slug = generateSlug(formData.title);
          
          // Check if new slug conflicts with another blog
          const conflict = this.blogs.find(blog => blog.slug === slug && blog.id !== id);
          if (conflict) {
            this.error = 'A blog with this title already exists';
            return null;
          }
        }

        // Recalculate reading time if content changed
        let readingTime = existingBlog.readingTime;
        if (formData.content && formData.content !== existingBlog.content) {
          readingTime = calculateReadingTime(formData.content);
        }

        // Update blog post
        const updatedBlog: BlogPost = {
          ...existingBlog,
          ...formData,
          slug,
          readingTime,
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
