/**
 * Blog Type Definitions
 * 
 * Defines TypeScript interfaces for blog post data structure,
 * categories, and form inputs.
 */

/**
 * Blog Category Type
 * Predefined categories for construction-related blog content
 */
export type BlogCategory = 
  | 'Construction Tips'
  | 'Project Updates'
  | 'Industry News'
  | 'Design Ideas'
  | 'Safety & Compliance'
  | 'Material Guide';

/**
 * Blog Post Interface
 * Complete structure for a blog post entity
 */
export interface BlogPost {
  /** Unique identifier (auto-generated from title) */
  id: string;
  
  /** URL-friendly slug for routing */
  slug: string;
  
  /** Blog post title */
  title: string;
  
  /** Short description/excerpt (150-200 characters) */
  description: string;
  
  /** Cover/hero image URL or base64 data */
  coverImage: string;
  
  /** Full blog content (supports HTML formatting) */
  content: string;
  
  /** Blog category */
  category: BlogCategory;
  
  /** Author name (default: "Thapa Construction") */
  author: string;
  
  /** Publication date */
  publishedAt: Date;
  
  /** Last update date */
  updatedAt?: Date;
  
  /** Reading time in minutes (auto-calculated) */
  readingTime: number;
  
  /** Featured flag for homepage display */
  featured?: boolean;
  
  /** View count (optional) */
  views?: number;
}

/**
 * Blog Form Input Interface
 * Used for creating/editing blog posts
 */
export interface BlogFormInput {
  title: string;
  description: string;
  coverImage: string;
  content: string;
  category: BlogCategory;
  featured?: boolean;
}

/**
 * Blog Filter Options
 * Used for filtering blog posts
 */
export interface BlogFilterOptions {
  category?: BlogCategory | 'all';
  searchQuery?: string;
  sortBy?: 'date' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}
