/**
 * Frequently Asked Questions Data
 * 
 * Centralized FAQ data for Thapa Construction website.
 * This file contains all FAQs that can be displayed across different pages.
 * 
 * @module data/faqs
 */

/**
 * FAQ Item Interface
 * 
 * @interface FAQ
 * @property {string} question - The FAQ question text
 * @property {string} answer - The detailed answer to the question
 * @property {string} [category] - Optional category for filtering (e.g., 'general', 'pricing', 'timeline')
 */
export interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

/**
 * All Frequently Asked Questions
 * 
 * This array contains all FAQs available for the Thapa Construction website.
 * Questions are ordered by importance and relevance.
 * 
 * @type {FAQ[]}
 */
export const allFAQs: FAQ[] = [
  {
    question: 'What areas do you serve?',
    answer: 'We primarily serve Darjeeling district and surrounding areas in West Bengal, including Kalimpong, Kurseong, and Siliguri. For larger projects, we may consider locations throughout North Bengal.',
    category: 'general'
  },
  {
    question: 'How do I get a quote for my construction project?',
    answer: 'You can request a quote by filling out our contact form, calling our office directly, or sending us an email with project details. We typically respond within 24-48 hours to schedule a consultation.',
    category: 'general'
  },
  {
    question: 'What types of projects do you handle?',
    answer: 'We handle a wide range of construction projects including residential homes, commercial buildings, renovations, remodeling, architectural design, and interior design. No project is too small or too large for our team.',
    category: 'services'
  },
  {
    question: 'How long does a typical construction project take?',
    answer: 'Project timelines vary significantly based on scope, complexity, and size. A small renovation might take a few weeks, while a custom home could take 6-12 months. During consultation, we provide a detailed timeline specific to your project.',
    category: 'timeline'
  },
  {
    question: 'Do you provide warranties for your construction work?',
    answer: 'Yes, we provide warranties for our construction work. The specific terms and duration vary by project type, but typically include a 1-year workmanship warranty and pass-through warranties from material manufacturers.',
    category: 'warranty'
  },
  {
    question: 'Can you help with obtaining construction permits?',
    answer: 'Yes, we assist with the permit application process as part of our services. Our team is familiar with local building codes and regulations in Darjeeling and surrounding areas.',
    category: 'services'
  }
];

/**
 * Get FAQs by category
 * 
 * Filters FAQ list by specified category.
 * 
 * @param {string} category - The category to filter by
 * @returns {FAQ[]} Filtered array of FAQs
 */
export const getFAQsByCategory = (category: string): FAQ[] => {
  return allFAQs.filter(faq => faq.category === category);
};

/**
 * Get limited number of FAQs
 * 
 * Returns a subset of FAQs, useful for preview sections.
 * 
 * @param {number} limit - Maximum number of FAQs to return
 * @returns {FAQ[]} Limited array of FAQs
 */
export const getLimitedFAQs = (limit: number): FAQ[] => {
  return allFAQs.slice(0, limit);
};
