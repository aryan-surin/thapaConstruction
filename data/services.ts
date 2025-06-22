/**
 * Services data for Thapa Construction website
 * 
 * This module provides structured data for all construction services offered
 * by Thapa Construction, ensuring consistent representation across the site.
 */

/**
 * Interface for service data structure
 */
export interface ServiceData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  detailedImage: string | null;
  icon: string;
  imageRight: boolean;
  features: string[];
}

/**
 * Complete list of construction services offered by Thapa Construction
 * Using template literals for multi-line strings to avoid apostrophe issues
 */
export const services: ServiceData[] = [
  {
    id: 'general',
    title: 'General Construction',
    description: 'Full-service construction solutions for residential and commercial projects, built to the highest standards.',
    longDescription: `Our general construction services cover all aspects of building projects from foundation to finishing touches. With expertise in diverse construction methods and materials, we deliver structures that are both aesthetically pleasing and structurally sound.`,
    image: '/images/services/general-construction.jpg',
    detailedImage: '/images/services/general-construction-detail.jpg',
    icon: 'heroicons:building-office-2',
    imageRight: false,
    features: [
      'Complete building construction from ground up',
      'Expert project management throughout the construction process',
      'Adherence to building codes and safety standards',
      'Quality materials and craftsmanship',
      'Transparent communication and regular progress updates',
      'Comprehensive warranties on all work'
    ]
  },
  {
    id: 'residential',
    title: 'Residential & Commercial',
    description: 'Custom home building and commercial construction services tailored to meet your specific needs and vision.',
    longDescription: `Whether you're building a family home or a commercial complex, our team brings the same dedication to quality and attention to detail. We specialize in custom designs that reflect your unique preferences and requirements.`,
    image: '/images/services/residential-commercial.jpg',
    detailedImage: '/images/services/residential-commercial-detail.jpg',
    icon: 'heroicons:home',
    imageRight: true,
    features: [
      'Custom home design and construction',
      'Commercial building development',
      'Multi-family residential projects',
      'Office and retail space construction',
      'Hospitality and restaurant construction',
      'Educational and institutional facilities'
    ]
  },
  {
    id: 'renovation',
    title: 'Renovation & Remodeling',
    description: 'Transform your existing space with our comprehensive renovation and remodeling services.',
    longDescription: `Our renovation and remodeling services breathe new life into existing structures. From simple updates to complete transformations, we help you reimagine your space while increasing functionality and value.`,
    image: '/images/services/renovation.jpg',
    detailedImage: '/images/services/renovation-detail.jpg',
    icon: 'heroicons:wrench-screwdriver',
    imageRight: false,
    features: [
      'Kitchen and bathroom remodeling',
      'Structural renovations and additions',
      'Historic building restoration',
      'Space optimization and reconfiguration',
      'Energy efficiency upgrades',
      'Accessibility modifications'
    ]
  },
  {
    id: 'management',
    title: 'Project Management',
    description: 'Expert project management and labor supply to ensure your project runs smoothly from start to finish.',
    longDescription: `Our project management team coordinates all aspects of construction, from planning and scheduling to resource allocation and quality control. We ensure your project stays on track, on budget, and meets all requirements.`,
    image: '/images/services/project-management.jpg',
    detailedImage: null,
    icon: 'heroicons:clipboard-document-check',
    imageRight: true,
    features: [
      'Comprehensive project planning and scheduling',
      'Budget development and cost control',
      'Skilled labor recruitment and management',
      'Vendor and subcontractor coordination',
      'Quality assurance and control',
      'Risk management and problem resolution'
    ]
  },
  {
    id: 'design',
    title: 'Architectural Design & Planning',
    description: 'Creative and functional architectural solutions that bring your vision to life with precision.',
    longDescription: `Our architectural design and planning services combine creativity with technical expertise to create spaces that are both beautiful and functional. We work closely with you to understand your needs and translate them into detailed plans.`,
    image: '/images/services/architectural-design.jpg',
    detailedImage: null,
    icon: 'heroicons:document',
    imageRight: false,
    features: [
      'Concept development and design visualization',
      'Detailed architectural drawings and specifications',
      'Building information modeling (BIM)',
      'Site planning and analysis',
      'Permit acquisition assistance',
      'Sustainable and green building design'
    ]
  },
  {
    id: 'interior',
    title: 'Interior Design & Roofing',
    description: 'Enhance your space with our expert interior design services and durable, stylish roofing solutions.',
    longDescription: `Our interior design services create spaces that reflect your personal style and meet your practical needs. We also provide high-quality roofing solutions that protect your investment with durability and aesthetic appeal.`,
    image: '/images/services/interior-roofing.jpg',
    detailedImage: null,
    icon: 'heroicons:home-modern',
    imageRight: true,
    features: [
      'Custom interior design plans',
      'Material and finish selection',
      'Furniture and fixture placement',
      'Roof installation and replacement',
      'Roof repair and maintenance',
      'Various roofing material options'
    ]
  },
  {
    id: 'flooring',
    title: 'Flooring, Tiling & Painting',
    description: 'Complete finishing services including expert flooring installation, precision tiling, and quality painting.',
    longDescription: `Our finishing services add the final touch to your space, with expert installation of flooring and tiles, as well as professional painting for both interior and exterior surfaces. We use quality materials and proven techniques for results that last.`,
    image: '/images/services/flooring-painting.jpg',
    detailedImage: null,
    icon: 'heroicons:paint-brush',
    imageRight: false,
    features: [
      'Hardwood, laminate, and tile flooring installation',
      'Custom tile work for bathrooms and kitchens',
      'Interior painting and wallpaper installation',
      'Exterior painting and staining',
      'Decorative finishes and techniques',
      'Floor refinishing and restoration'
    ]
  }
];

/**
 * Get a service by its ID
 * 
 * @param {string} id - Service identifier
 * @returns {ServiceData|undefined} - The service object or undefined if not found
 */
export function getServiceById(id: string): ServiceData | undefined {
  return services.find(service => service.id === id);
}

/**
 * Get featured services (for homepage display)
 * 
 * @param {number} limit - Maximum number of services to return
 * @returns {ServiceData[]} - Array of featured services
 */
export function getFeaturedServices(limit: number = 3): ServiceData[] {
  // Return the first N services 
  // TODO: Add a "featured" flag to services and filter by that instead
  return services.slice(0, limit);
}
