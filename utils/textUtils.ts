/**
 * Text utilities for handling content safely throughout the application
 */

/**
 * Safely escape single quotes in text if using single-quoted strings
 * 
 * @param {string} text - Input text that may contain apostrophes
 * @returns {string} - Text with apostrophes escaped
 */
export function escapeApostrophes(text: string): string {
  return text.replace(/'/g, "\\'");
}

/**
 * Sanitize user input to prevent XSS attacks
 * Use this for any dynamic content from users before displaying
 * 
 * @param {string} html - Potentially unsafe HTML string
 * @returns {string} - Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Truncate text to a specified length, adding ellipsis if needed
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length of text
 * @returns {string} - Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
}

/**
 * Format a string with named placeholders
 * Example: formatString("Hello, {name}!", { name: "World" }) => "Hello, World!"
 * 
 * @param {string} template - String template with {placeholders}
 * @param {Record<string, any>} params - Values for the placeholders
 * @returns {string} - Formatted string
 */
export function formatString(template: string, params: Record<string, any>): string {
  return template.replace(/{([^{}]*)}/g, (match, key) => {
    const value = params[key];
    return value !== undefined ? String(value) : match;
  });
}
