<template>
  <div>
    <!-- Hero -->
    <Hero
      backgroundImage="/images/projects-hero.jpg"
      title="Our Projects"
      description="Explore our portfolio of completed construction projects showcasing our expertise and quality craftsmanship."
      primaryButtonText="Contact Us"
      primaryButtonLink="/contact"
    />

    <!-- Project Filter -->
    <section class="py-12 bg-secondary">
      <div class="container-custom">
        <div class="flex flex-wrap items-center justify-center gap-4">
          <button
            @click="activeCategory = 'all'"
            class="px-6 py-2 rounded-full transition-all duration-300"
            :class="activeCategory === 'all' ? 'bg-accent text-primary' : 'bg-white text-neutral hover:bg-primary/10'"
          >
            All Projects
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="activeCategory = category"
            class="px-6 py-2 rounded-full transition-all duration-300"
            :class="activeCategory === category ? 'bg-accent text-primary' : 'bg-white text-neutral hover:bg-primary/10'"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="py-20">
      <div class="container-custom">
        <div 
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          v-if="filteredProjects.length > 0"
        >
          <ProjectCard
            v-for="project in filteredProjects"
            :key="project.id"
            :title="project.title"
            :description="project.description"
            :category="project.category"
            :location="project.location"
            :image="project.image"
            :link="`/projects/${project.id}`"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <Icon name="heroicons:folder-open" class="w-16 h-16 text-neutral/30 mx-auto mb-4" />
          <h3 class="text-2xl font-bold text-primary mb-2">No Projects Found</h3>
          <p class="text-neutral">No projects match the selected category. Please try a different category.</p>
          <button
            @click="activeCategory = 'all'"
            class="mt-6 btn-primary"
          >
            View All Projects
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Project Spotlight -->
    <section v-if="featuredProject" class="py-20 bg-secondary">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Featured Project</h2>
          <p class="text-neutral">
            Take a closer look at one of our standout projects that showcases our capabilities and attention to detail.
          </p>
        </div>

        <div class="bg-white rounded-lg overflow-hidden shadow-xl">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="relative h-96 lg:h-auto">
              <img 
                :src="featuredProject.fullImage || featuredProject.image" 
                :alt="featuredProject.title" 
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div class="p-8 lg:p-12">
              <div class="flex items-center mb-4">
                <span class="px-4 py-1 bg-accent/20 text-primary rounded-full text-sm font-medium">
                  {{ featuredProject.category }}
                </span>
                <span class="ml-4 text-neutral text-sm">
                  {{ featuredProject.location }}
                </span>
              </div>
              <h3 class="text-3xl font-bold text-primary mb-4">{{ featuredProject.title }}</h3>
              <p class="text-neutral mb-6">{{ featuredProject.description }}</p>
              
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-primary mb-3">Project Details</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="(value, key) in featuredProject.details" :key="key" class="flex items-start">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 text-accent mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <span class="font-medium text-primary">{{ key }}: </span>
                      <span class="text-neutral">{{ value }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <NuxtLink 
                :to="`/projects/${featuredProject.id}`" 
                class="btn-primary inline-flex items-center"
              >
                View Project Details
                <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Client Logos -->
    <section class="py-20">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Our Clients</h2>
          <p class="text-neutral">
            We're proud to have worked with these esteemed clients who trust us with their construction needs.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div v-for="(client, index) in clients" :key="index" class="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <img :src="client.logo" :alt="client.name" class="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300">
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-primary text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('/images/cta-bg.jpg')"></div>
      <div class="container-custom relative z-10 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Let's Build Your Next Project</h2>
        <p class="text-white/90 text-lg max-w-3xl mx-auto mb-8">
          Ready to start your construction journey with Thapa Construction? Contact us today for a consultation and let us bring your vision to life.
        </p>
        <NuxtLink to="/contact" class="btn bg-accent text-primary hover:bg-white transition-all duration-300">
          Start Your Project
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// SEO
useHead({
  title: 'Our Projects - Thapa Construction',
  meta: [
    { 
      name: 'description', 
      content: 'View our portfolio of completed construction projects in Darjeeling. Explore residential homes, commercial buildings, renovations, and architectural designs by Thapa Construction.' 
    }
  ]
});

/**
 * Project data structure
 * In a production environment, this would likely be fetched from a CMS or API
 */
const projects = ref([
  {
    id: 'himalayan-heights',
    title: 'Himalayan Heights Residences',
    description: 'Luxury residential complex with stunning mountain views and modern amenities.',
    category: 'Residential',
    location: 'Darjeeling',
    image: '/images/projects/residential-1.jpg',
    fullImage: '/images/projects/residential-1-full.jpg',
    featured: true,
    details: {
      'Completion': 'June 2022',
      'Area': '15,000 sq ft',
      'Units': '10 luxury apartments',
      'Services': 'Design & Construction',
      'Duration': '18 months',
      'Special Features': 'Rooftop garden, Mountain views'
    }
  },
  {
    id: 'tea-estate-office',
    title: 'Tea Estate Office Complex',
    description: 'Modern office building for a prominent tea estate featuring sustainable design elements.',
    category: 'Commercial',
    location: 'Kurseong',
    image: '/images/projects/commercial-1.jpg',
    fullImage: '/images/projects/commercial-1-full.jpg',
    featured: false,
    details: {
      'Completion': 'March 2023',
      'Area': '8,000 sq ft',
      'Services': 'Architecture & Construction',
      'Duration': '12 months',
      'Special Features': 'Solar panels, Rainwater harvesting'
    }
  },
  {
    id: 'heritage-villa',
    title: 'Heritage Villa Restoration',
    description: 'Complete restoration of a 100-year-old colonial villa preserving historical elements while adding modern amenities.',
    category: 'Renovation',
    location: 'Darjeeling',
    image: '/images/projects/renovation-1.jpg',
    fullImage: '/images/projects/renovation-1-full.jpg',
    featured: false,
    details: {
      'Completion': 'December 2021',
      'Area': '4,500 sq ft',
      'Services': 'Restoration & Renovation',
      'Duration': '9 months',
      'Special Features': 'Original woodwork preservation, Modern conveniences'
    }
  },
  {
    id: 'mountain-view-resort',
    title: 'Mountain View Resort',
    description: 'Luxury resort with panoramic views of the Himalayas, featuring sustainable architecture and local materials.',
    category: 'Hospitality',
    location: 'Kalimpong',
    image: '/images/projects/hospitality-1.jpg',
    featured: false,
    details: {
      'Completion': 'October 2022',
      'Area': '25,000 sq ft',
      'Rooms': '30 suites',
      'Services': 'Design & Construction',
      'Duration': '24 months',
      'Special Features': 'Infinity pool, Spa, Conference facilities'
    }
  },
  {
    id: 'city-center-mall',
    title: 'City Center Mall',
    description: 'Modern retail complex with multiple shops, restaurants, and entertainment facilities in the heart of the city.',
    category: 'Commercial',
    location: 'Siliguri',
    image: '/images/projects/commercial-2.jpg',
    featured: false,
    details: {
      'Completion': 'July 2021',
      'Area': '40,000 sq ft',
      'Units': '45 retail spaces',
      'Services': 'Construction',
      'Duration': '30 months',
      'Special Features': 'Food court, Cinema, Underground parking'
    }
  },
  {
    id: 'green-valley-homes',
    title: 'Green Valley Homes',
    description: 'Eco-friendly residential community with 25 individual homes designed with sustainability in mind.',
    category: 'Residential',
    location: 'Darjeeling',
    image: '/images/projects/residential-2.jpg',
    featured: false,
    details: {
      'Completion': 'September 2023',
      'Area': '50,000 sq ft (total)',
      'Units': '25 homes',
      'Services': 'Design & Construction',
      'Duration': '36 months',
      'Special Features': 'Solar power, Organic gardens, Community center'
    }
  },
  {
    id: 'public-library',
    title: 'Darjeeling Public Library',
    description: 'Modern public library with reading spaces, digital resources, and community meeting rooms.',
    category: 'Institutional',
    location: 'Darjeeling',
    image: '/images/projects/institutional-1.jpg',
    featured: false,
    details: {
      'Completion': 'April 2022',
      'Area': '12,000 sq ft',
      'Services': 'Design & Construction',
      'Duration': '15 months',
      'Special Features': 'Digital archive room, Children\'s section, Outdoor reading garden'
    }
  },
  {
    id: 'darjeeling-clinic',
    title: 'Darjeeling Medical Clinic',
    description: 'State-of-the-art medical facility providing healthcare services to the local community.',
    category: 'Institutional',
    location: 'Darjeeling',
    image: '/images/projects/institutional-2.jpg',
    featured: false,
    details: {
      'Completion': 'January 2023',
      'Area': '18,000 sq ft',
      'Services': 'Construction',
      'Duration': '18 months',
      'Special Features': 'Diagnostic center, Emergency department, Modern equipment'
    }
  },
  {
    id: 'urban-loft-conversion',
    title: 'Urban Loft Conversion',
    description: 'Conversion of an old warehouse into modern urban lofts with open floor plans and industrial aesthetics.',
    category: 'Renovation',
    location: 'Siliguri',
    image: '/images/projects/renovation-2.jpg',
    featured: false,
    details: {
      'Completion': 'May 2023',
      'Area': '20,000 sq ft',
      'Units': '15 lofts',
      'Services': 'Renovation & Interior Design',
      'Duration': '14 months',
      'Special Features': 'Exposed brick walls, High ceilings, Original beam structure'
    }
  },
]);

/**
 * Extract unique categories from projects
 */
const categories = computed(() => {
  const uniqueCategories = new Set(projects.value.map(project => project.category));
  return Array.from(uniqueCategories);
});

/**
 * Currently active filter category
 */
const activeCategory = ref('all');

/**
 * Filter projects based on selected category
 */
const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') {
    return projects.value;
  }
  return projects.value.filter(project => project.category === activeCategory.value);
});

/**
 * Find the featured project (if any)
 */
const featuredProject = computed(() => {
  return projects.value.find(project => project.featured);
});

/**
 * Client companies that have worked with Thapa Construction
 */
const clients = ref([
  { name: 'Darjeeling Tea Estates', logo: '/images/clients/client1.png' },
  { name: 'Himalaya Hotels', logo: '/images/clients/client2.png' },
  { name: 'Mountain Development Corp', logo: '/images/clients/client3.png' },
  { name: 'West Bengal Government', logo: '/images/clients/client4.png' },
  { name: 'Eastern Realty', logo: '/images/clients/client5.png' },
  { name: 'Siliguri Commercial Group', logo: '/images/clients/client6.png' }
]);
</script>
