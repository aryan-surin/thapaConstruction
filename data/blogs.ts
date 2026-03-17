/**
 * Blog Posts Data
 * 
 * Initial hardcoded blog posts for demonstration.
 * In production, this would be fetched from a database.
 * 
 * @module data/blogs
 */

import type { BlogPost, BlogCategory } from '~/types/blog';

/**
 * Predefined Blog Categories
 * Constant list of available blog categories for construction content
 */
export const BLOG_CATEGORIES: BlogCategory[] = [
  'Construction Tips',
  'Project Updates',
  'Industry News',
  'Design Ideas',
  'Safety & Compliance',
  'Material Guide'
];

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 * 
 * @param content - Blog content HTML/text
 * @returns Reading time in minutes
 */
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = textContent.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime > 0 ? readingTime : 1;
};

/**
 * Generate URL-friendly slug from title
 * 
 * @param title - Blog post title
 * @returns URL-safe slug
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Remove consecutive hyphens
};

/**
 * Initial Sample Blog Posts
 * Demonstrates blog structure and content formatting
 */
export const sampleBlogs: BlogPost[] = [
  {
    id: '1',
    slug: 'essential-construction-safety-tips-for-2026',
    title: 'Essential Construction Safety Tips for 2026',
    description: 'Learn the latest safety protocols and best practices to ensure a secure construction site. Protecting your team is our top priority.',
    coverImage: '/images/blog/safety-tips.jpg',
    content: `
      <div class="prose max-w-none">
        <p class="lead">Construction site safety is paramount to project success. In this comprehensive guide, we'll explore the essential safety measures every construction professional should implement in 2026.</p>
        
        <h2>1. Personal Protective Equipment (PPE)</h2>
        <p>Every worker on site must have access to proper PPE:</p>
        <ul>
          <li><strong>Hard hats:</strong> Protect against falling objects and head injuries</li>
          <li><strong>Safety boots:</strong> Steel-toed boots prevent foot injuries</li>
          <li><strong>High-visibility vests:</strong> Ensure workers are visible at all times</li>
          <li><strong>Safety glasses:</strong> Protect eyes from debris and dust</li>
          <li><strong>Gloves:</strong> Prevent hand injuries and improve grip</li>
        </ul>
        
        <h2>2. Site Organization and Housekeeping</h2>
        <p>A clean, organized site is a safe site. Maintain clear walkways, properly store materials, and regularly remove debris. This reduces trip hazards and improves overall efficiency.</p>
        
        <h2>3. Equipment Maintenance</h2>
        <p>Regular inspection and maintenance of all equipment is crucial. Never use faulty or damaged tools, and ensure all machinery is operated by trained personnel only.</p>
        
        <h2>4. Communication and Training</h2>
        <p>Hold daily safety briefings, provide ongoing training, and establish clear communication protocols. Every team member should know emergency procedures and feel empowered to report hazards.</p>
        
        <blockquote>
          <p>"Safety isn't expensive, it's priceless. At Thapa Construction, we believe that every worker deserves to return home safely every day."</p>
        </blockquote>
        
        <h2>5. Weather Awareness</h2>
        <p>In Darjeeling and Jalpiguri districts, weather can change rapidly. Monitor forecasts, have protocols for extreme conditions, and never compromise safety for deadlines.</p>
        
        <h2>Conclusion</h2>
        <p>Implementing these safety measures creates a culture of care and responsibility. At Thapa Construction, safety is integrated into every aspect of our work, ensuring successful projects and protected teams.</p>
      </div>
    `,
    category: 'Safety & Compliance',
    author: 'Thapa Construction',
    publishedAt: new Date('2026-03-15'),
    readingTime: 5,
    featured: true,
    views: 1245
  },
  {
    id: '2',
    slug: 'modern-kitchen-design-trends-2026',
    title: 'Modern Kitchen Design Trends 2026',
    description: 'Discover the hottest kitchen design trends transforming homes across Darjeeling. From smart storage to sustainable materials.',
    coverImage: '/images/blog/kitchen-trends.jpg',
    content: `
      <div class="prose max-w-none">
        <p class="lead">Kitchen design has evolved dramatically in recent years. Here are the top trends dominating modern kitchen renovations in 2026.</p>
        
        <h2>1. Smart Storage Solutions</h2>
        <p>Modern kitchens maximize every inch of space with innovative storage:</p>
        <ul>
          <li>Pull-out pantry systems</li>
          <li>Corner carousel units</li>
          <li>Hidden appliance garages</li>
          <li>Vertical dividers for baking sheets and cutting boards</li>
        </ul>
        
        <h2>2. Sustainable Materials</h2>
        <p>Eco-conscious homeowners are choosing sustainable options like bamboo cabinetry, recycled countertops, and energy-efficient appliances. These choices reduce environmental impact while adding unique character.</p>
        
        <h2>3. Statement Lighting</h2>
        <p>Pendant lights have become focal points, combining functionality with artistic design. Layered lighting creates ambiance while ensuring practical task illumination.</p>
        
        <h2>4. Bold Color Choices</h2>
        <p>While white kitchens remain popular, we're seeing more homeowners embrace navy blues, forest greens, and warm terracotta tones. These colors add personality and warmth.</p>
        
        <h2>5. Integrated Technology</h2>
        <p>Smart appliances, touchless faucets, and built-in charging stations are becoming standard. Technology enhances convenience without compromising aesthetics.</p>
        
        <h2>Working with Thapa Construction</h2>
        <p>Our team specializes in creating custom kitchens that blend these trends with your personal style. We handle everything from design consultation to final installation, ensuring your dream kitchen becomes reality.</p>
      </div>
    `,
    category: 'Design Ideas',
    author: 'Thapa Construction',
    publishedAt: new Date('2026-03-10'),
    readingTime: 4,
    featured: false,
    views: 892
  },
  {
    id: '3',
    slug: 'choosing-right-construction-materials-mountain-climate',
    title: 'Choosing the Right Construction Materials for Mountain Climate',
    description: 'A comprehensive guide to selecting durable, weather-resistant materials perfect for Darjeeling\'s unique climate conditions.',
    coverImage: '/images/blog/materials-guide.jpg',
    content: `
      <div class="prose max-w-none">
        <p class="lead">Building in Darjeeling's mountain climate requires careful material selection. Temperature fluctuations, heavy rainfall, and humidity demand materials that withstand harsh conditions while maintaining structural integrity.</p>
        
        <h2>Understanding Darjeeling's Climate Challenges</h2>
        <p>Our region experiences:</p>
        <ul>
          <li>Heavy monsoon rainfall (June-September)</li>
          <li>Cold winters with occasional frost</li>
          <li>High humidity year-round</li>
          <li>Significant temperature variations between day and night</li>
        </ul>
        
        <h2>Best Materials for Mountain Construction</h2>
        
        <h3>1. Foundation Materials</h3>
        <p><strong>Recommended:</strong> Reinforced concrete with proper waterproofing. Stone foundations also work well due to excellent drainage properties and natural resistance to moisture.</p>
        
        <h3>2. Wall Materials</h3>
        <p><strong>Brick and concrete blocks:</strong> Provide excellent thermal mass and moisture resistance when properly treated. Always use high-quality mortar with waterproofing additives.</p>
        
        <h3>3. Roofing</h3>
        <p><strong>Metal roofing (galvalume or color-coated sheets):</strong> Excellent for heavy rain areas, lightweight, and long-lasting. Ensure proper slope (minimum 30 degrees) for effective drainage.</p>
        
        <h3>4. Exterior Finishes</h3>
        <p><strong>Weather-resistant paints and coatings:</strong> Use acrylic or elastomeric paints designed for high-humidity environments. These prevent dampness penetration and resist mold growth.</p>
        
        <h3>5. Wood Selection</h3>
        <p>When using wood, choose treated timber or naturally resistant species like teak or sal. Proper treatment prevents termite damage and moisture absorption.</p>
        
        <h2>Waterproofing is Essential</h2>
        <p>Never skip waterproofing in mountain construction. Apply quality waterproofing to:</p>
        <ul>
          <li>Foundation and basement walls</li>
          <li>Bathroom and kitchen floors</li>
          <li>Roof terraces and balconies</li>
          <li>External wall surfaces</li>
        </ul>
        
        <h2>Insulation Matters</h2>
        <p>Proper insulation keeps homes comfortable year-round while reducing energy costs. Consider mineral wool or foam insulation for walls and ceilings.</p>
        
        <blockquote>
          <p>"At Thapa Construction, we've spent years perfecting material selection for mountain environments. Our experience ensures your building stands strong for generations."</p>
        </blockquote>
        
        <h2>Cost vs. Quality</h2>
        <p>While quality materials may cost more initially, they save money long-term through reduced maintenance and better durability. We help clients balance budget with quality for optimal results.</p>
        
        <h2>Conclusion</h2>
        <p>Material selection dramatically impacts your building's longevity and performance. Consult with experienced professionals who understand local conditions. Thapa Construction brings decades of expertise to every project.</p>
      </div>
    `,
    category: 'Material Guide',
    author: 'Thapa Construction',
    publishedAt: new Date('2026-03-05'),
    readingTime: 6,
    featured: true,
    views: 1567
  },
  {
    id: '4',
    slug: 'premium-modular-kitchen-project-completion',
    title: 'Premium Modular Kitchen Project Completion',
    description: 'Take a behind-the-scenes look at our recent premium modular kitchen installation project in Darjeeling. From design to execution.',
    coverImage: '/images/projects/premium-modular-kitchen-installation/kitchen-1.jpg',
    content: `
      <div class="prose max-w-none">
        <p class="lead">We're excited to share the successful completion of a stunning premium modular kitchen project in Darjeeling. This project showcases our commitment to quality craftsmanship and attention to detail.</p>
        
        <h2>Project Overview</h2>
        <p><strong>Location:</strong> Darjeeling<br>
        <strong>Duration:</strong> 3 weeks<br>
        <strong>Type:</strong> Premium Modular Kitchen Installation</p>
        
        <h2>Client Requirements</h2>
        <p>Our clients wanted a modern, functional kitchen that maximized storage while maintaining an elegant aesthetic. Key requirements included:</p>
        <ul>
          <li>Abundant storage for a large family</li>
          <li>High-quality, durable materials</li>
          <li>Integrated appliances for a seamless look</li>
          <li>Separate preparation and cooking zones</li>
          <li>Easy-to-maintain surfaces</li>
        </ul>
        
        <h2>Design Solutions</h2>
        <p>We created a custom design featuring:</p>
        <ul>
          <li><strong>L-shaped layout:</strong> Optimized workflow and maximized counter space</li>
          <li><strong>Two-tone cabinetry:</strong> Cream upper cabinets with charcoal base units</li>
          <li><strong>Quartz countertops:</strong> Durable, heat-resistant, and easy to clean</li>
          <li><strong>Soft-close mechanisms:</strong> On all drawers and cabinets for longevity</li>
          <li><strong>Under-cabinet lighting:</strong> LED strips for excellent task lighting</li>
        </ul>
        
        <h2>Execution Excellence</h2>
        <p>Our experienced team handled every aspect:</p>
        <ol>
          <li><strong>Precise measurements:</strong> Ensuring perfect fit in the available space</li>
          <li><strong>Quality materials:</strong> Sourced from trusted suppliers</li>
          <li><strong>Expert installation:</strong> Skilled craftsmen with years of experience</li>
          <li><strong>Plumbing and electrical:</strong> Coordinated all auxiliary work</li>
          <li><strong>Final touches:</strong> Detailed finishing for a polished result</li>
        </ol>
        
        <h2>Client Feedback</h2>
        <blockquote>
          <p>"Thapa Construction transformed our kitchen beyond our expectations. Their professionalism, quality of work, and attention to detail made the entire process smooth and enjoyable. We couldn't be happier with the result!"</p>
        </blockquote>
        
        <h2>Key Takeaways</h2>
        <p>This project demonstrates several important principles:</p>
        <ul>
          <li>Thorough planning prevents execution problems</li>
          <li>Quality materials justify the investment</li>
          <li>Skilled craftsmanship makes the difference</li>
          <li>Clear communication ensures client satisfaction</li>
        </ul>
        
        <h2>Interested in a Kitchen Renovation?</h2>
        <p>If you're considering a kitchen renovation or modular kitchen installation, we'd love to discuss your project. Our team brings expertise, creativity, and dedication to every job.</p>
        
        <p><strong>Contact us today for a free consultation!</strong></p>
      </div>
    `,
    category: 'Project Updates',
    author: 'Thapa Construction',
    publishedAt: new Date('2026-02-28'),
    readingTime: 4,
    featured: false,
    views: 743
  }
];

/**
 * Get all blog posts
 * @returns Array of all blog posts
 */
export const getAllBlogs = (): BlogPost[] => {
  return sampleBlogs;
};

/**
 * Get blog post by slug
 * @param slug - URL slug of the blog post
 * @returns Blog post or undefined if not found
 */
export const getBlogBySlug = (slug: string): BlogPost | undefined => {
  return sampleBlogs.find(blog => blog.slug === slug);
};

/**
 * Get featured blog posts
 * @param limit - Maximum number of posts to return
 * @returns Array of featured blog posts
 */
export const getFeaturedBlogs = (limit?: number): BlogPost[] => {
  const featured = sampleBlogs.filter(blog => blog.featured);
  return limit ? featured.slice(0, limit) : featured;
};

/**
 * Get recent blog posts
 * @param limit - Maximum number of posts to return
 * @returns Array of recent blog posts sorted by date
 */
export const getRecentBlogs = (limit?: number): BlogPost[] => {
  const sorted = [...sampleBlogs].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
};

/**
 * Get blogs by category
 * @param category - Blog category to filter by
 * @returns Array of blog posts in the specified category
 */
export const getBlogsByCategory = (category: BlogCategory): BlogPost[] => {
  return sampleBlogs.filter(blog => blog.category === category);
};
