/**
 * HTML Sanitization Utility
 * 
 * Provides secure HTML sanitization to prevent XSS attacks
 * Uses DOMPurify (isomorphic version for SSR compatibility)
 * 
 * @module utils/sanitize
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Configuration for allowed HTML tags and attributes
 * Balances security with content richness for blog posts
 */
const SANITIZE_CONFIG = {
  /**
   * Allowed HTML tags for blog content
   * Carefully curated to allow rich formatting while blocking dangerous elements
   */
  ALLOWED_TAGS: [
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    
    // Text formatting
    'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins', 'mark', 'abbr',
    
    // Lists
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    
    // Quotes and code
    'blockquote', 'pre', 'code',
    
    // Links and images
    'a', 'img',
    
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'col', 'colgroup',
    
    // Semantic elements
    'div', 'span', 'article', 'section', 'aside', 'nav', 'header', 'footer', 'main',
    
    // Multimedia (with restrictions)
    'figure', 'figcaption',
    
    // Other
    'hr', 'sub', 'sup', 'small'
  ],

  /**
   * Allowed attributes for specific tags
   * Only safe attributes are permitted
   */
  ALLOWED_ATTR: [
    // Universal attributes (safe ones only)
    'id', 'class', 'title', 'lang', 'dir',
    
    // Link attributes
    'href', 'target', 'rel',
    
    // Image attributes
    'src', 'alt', 'width', 'height', 'loading',
    
    // Table attributes
    'colspan', 'rowspan', 'scope',
    
    // Semantic attributes
    'role', 'aria-label', 'aria-labelledby', 'aria-describedby',
    
    // Other safe attributes
    'datetime', 'abbr', 'cite'
  ],

  /**
   * Forbidden tags (explicitly blocked for security)
   * These can execute scripts or load external resources unsafely
   */
  FORBID_TAGS: [
    'script', 'style', 'iframe', 'embed', 'object', 'applet',
    'link', 'base', 'meta', 'form', 'input', 'textarea', 'button', 'select'
  ],

  /**
   * Forbidden attributes (event handlers and dangerous attributes)
   */
  FORBID_ATTR: [
    // Event handlers
    'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover',
    'onmousemove', 'onmouseout', 'onmouseenter', 'onmouseleave',
    'onload', 'onerror', 'onabort', 'onunload', 'onbeforeunload',
    'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
    'onkeydown', 'onkeypress', 'onkeyup',
    'onscroll', 'onresize', 'oncontextmenu',
    'ondrag', 'ondrop', 'onpaste', 'oncopy', 'oncut',
    
    // Dangerous attributes
    'formaction', 'action', 'srcdoc', 'data'
  ],

  /**
   * Additional security options
   */
  ALLOW_DATA_ATTR: false,        // Block data-* attributes
  ALLOW_UNKNOWN_PROTOCOLS: false, // Only allow http, https, mailto
  SAFE_FOR_TEMPLATES: true,       // Extra protection for template injection
  KEEP_CONTENT: true,             // Keep text content when removing tags
  RETURN_DOM: false,              // Return HTML string, not DOM
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
  FORCE_BODY: false,
  SANITIZE_DOM: true,             // Sanitize DOM elements
  IN_PLACE: false,
  USE_PROFILES: { html: true }    // Use HTML profile
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * 
 * This function removes dangerous HTML tags, attributes, and event handlers
 * while preserving safe formatting elements for blog content.
 * 
 * Security measures:
 * - Strips all script tags and event handlers
 * - Removes dangerous protocols (javascript:, data:, vbscript:)
 * - Sanitizes attributes to prevent injection
 * - Prevents DOM clobbering attacks
 * 
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 * 
 * @example
 * ```typescript
 * const userInput = '<script>alert("XSS")</script><p>Safe content</p>';
 * const safe = sanitizeHtml(userInput);
 * // Returns: '<p>Safe content</p>'
 * ```
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  try {
    // Apply DOMPurify with our security configuration
    const sanitized = DOMPurify.sanitize(html, SANITIZE_CONFIG);
    
    return sanitized;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    // On error, return empty string to prevent potential XSS
    return '';
  }
}

/**
 * Strict sanitization for user-generated content
 * More restrictive than sanitizeHtml - use for comments, reviews, etc.
 * 
 * Differences from sanitizeHtml():
 * - No images or iframes
 * - No tables
 * - No div/span styling
 * - Very limited HTML tags
 * 
 * @param html - Raw HTML string to sanitize
 * @returns Strictly sanitized HTML string
 */
export function sanitizeUserContent(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const strictConfig = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'blockquote', 'code'
    ],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  };

  try {
    return DOMPurify.sanitize(html, strictConfig);
  } catch (error) {
    console.error('Error sanitizing user content:', error);
    return '';
  }
}

/**
 * Sanitize plain text (strip all HTML)
 * Use for titles, descriptions, meta tags
 * 
 * @param text - Text to sanitize
 * @returns Plain text with all HTML removed
 */
export function sanitizePlainText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  try {
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [],
      KEEP_CONTENT: true
    });
  } catch (error) {
    console.error('Error sanitizing plain text:', error);
    return '';
  }
}

/**
 * Validate and sanitize URL to prevent javascript: and data: protocols
 * 
 * @param url - URL to validate
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Remove whitespace
  const trimmedUrl = url.trim();

  // Check for dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
  if (dangerousProtocols.test(trimmedUrl)) {
    console.warn('Blocked dangerous URL protocol:', trimmedUrl);
    return '';
  }

  // Allow http, https, mailto, tel, and relative URLs
  const allowedProtocols = /^(https?:|mailto:|tel:|\/|\.\/|\.\.\/)/i;
  if (allowedProtocols.test(trimmedUrl)) {
    return trimmedUrl;
  }

  // If no protocol, assume relative URL
  if (!trimmedUrl.includes(':')) {
    return trimmedUrl;
  }

  // Unknown protocol, block it
  console.warn('Blocked unknown URL protocol:', trimmedUrl);
  return '';
}

/**
 * Check if content contains potentially dangerous HTML
 * Use this for validation before saving content
 * 
 * @param html - HTML content to check
 * @returns Object with validation result and issues found
 */
export function validateHtmlSafety(html: string): {
  isSafe: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!html || typeof html !== 'string') {
    return { isSafe: true, issues: [] };
  }

  // Check for script tags
  if (/<script/i.test(html)) {
    issues.push('Contains <script> tags');
  }

  // Check for event handlers
  if (/on\w+\s*=/i.test(html)) {
    issues.push('Contains inline event handlers (onclick, onerror, etc.)');
  }

  // Check for javascript: protocol
  if (/javascript:/i.test(html)) {
    issues.push('Contains javascript: protocol in URLs');
  }

  // Check for data: protocol (can be used for XSS)
  if (/data:text\/html/i.test(html)) {
    issues.push('Contains data:text/html protocol');
  }

  // Check for iframe/embed
  if (/<(iframe|embed|object)/i.test(html)) {
    issues.push('Contains iframe, embed, or object tags');
  }

  return {
    isSafe: issues.length === 0,
    issues
  };
}
