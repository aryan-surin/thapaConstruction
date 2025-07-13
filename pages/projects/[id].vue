<template>
  <div v-if="project">
    <!-- Hero Section -->
    <div class="relative h-[50vh] lg:h-[70vh] w-full bg-gray-200 overflow-hidden">
      <!-- Image placeholder - will be replaced with actual project image -->
      <div 
        class="w-full h-full bg-cover bg-center"
        :style="{ backgroundImage: `url(${project.fullImage || project.image})` }"
      ></div>
      <div class="absolute inset-0 bg-primary/50"></div>
      
      <!-- Project title overlay -->
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <div class="mb-4">
          <span class="px-4 py-1 bg-accent text-primary rounded-full text-sm font-medium">
            {{ project.category }}
          </span>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold mb-2">{{ project.title }}</h1>
        <p class="text-xl max-w-3xl">{{ project.description }}</p>
      </div>
    </div>

    <!-- Project Details -->
    <section class="py-20">
      <div class="container mx-auto max-w-7xl px-4">
        <div class="flex flex-col lg:flex-row gap-12">
          <!-- Left Column - Project Information -->
          <div class="lg:w-2/3">
            <h2 class="text-3xl font-bold text-primary mb-8">Project Overview</h2>
            <p class="text-neutral mb-8">
              {{ project.description }} Located in {{ project.location }}, this {{ project.category.toLowerCase() }} 
              project showcases our commitment to quality construction and attention to detail.
            </p>

            <!-- Project Gallery (Placeholders) -->
            <h3 class="text-2xl font-bold text-primary mb-6">Project Gallery</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <!-- Gallery placeholders -->
              <div v-for="i in 4" :key="i" class="aspect-video bg-neutral/10 rounded-lg flex items-center justify-center">
                <div class="text-center">
                  <Icon name="heroicons:photo" class="w-16 h-16 text-neutral/30 mx-auto mb-2" />
                  <p class="text-neutral/50">Project Photo {{ i }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Project Details -->
          <div class="lg:w-1/3">
            <div class="bg-secondary p-8 rounded-lg shadow-md">
              <h3 class="text-xl font-bold text-primary mb-6">Project Details</h3>
              
              <div class="space-y-4">
                <div v-for="(value, key) in project.details" :key="key" class="border-b border-neutral/10 pb-3">
                  <div class="flex justify-between">
                    <span class="font-medium text-primary">{{ key }}</span>
                    <span class="text-neutral">{{ value }}</span>
                  </div>
                </div>

                <!-- Location info -->
                <div class="border-b border-neutral/10 pb-3">
                  <div class="flex justify-between">
                    <span class="font-medium text-primary">Location</span>
                    <span class="text-neutral">{{ project.location }}</span>
                  </div>
                </div>
              </div>
              
              <!-- CTA Button -->
              <div class="mt-8">
                <NuxtLink to="/contact" class="btn-primary w-full text-center">
                  Discuss a Similar Project
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Projects -->
    <section class="py-20 bg-secondary">
      <div class="container mx-auto max-w-7xl px-4">
        <h2 class="text-3xl font-bold text-primary mb-8 text-center">Other Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- This would be populated with actual related projects -->
          <div v-for="i in 3" :key="i" class="h-64 bg-white rounded-lg shadow-md flex items-center justify-center">
            <p class="text-neutral/50">Related Project {{ i }}</p>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <NuxtLink to="/projects" class="btn-outline">
            View All Projects
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('/images/cta-bg.jpg')"></div>
      <div class="container mx-auto max-w-7xl px-4 relative z-10 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Own Project?</h2>
        <p class="text-white/90 text-lg max-w-3xl mx-auto mb-8">
          Contact us today to discuss your construction needs and get a free consultation.
        </p>
        <NuxtLink to="/contact" class="btn bg-accent text-primary hover:bg-white transition-all duration-300">
          Contact Us
        </NuxtLink>
      </div>
    </section>
  </div>
  
  <!-- Loading/Not Found States -->
  <div v-else class="min-h-screen flex items-center justify-center bg-secondary">
    <div class="text-center p-8">
      <Icon name="svg-spinners:270-ring" class="w-16 h-16 text-accent mx-auto mb-6" />
      <h2 class="text-2xl font-bold text-primary">Loading Project...</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
// Get the route parameter (project ID)
const route = useRoute();
const id = route.params.id as string;

// SEO
useHead({
  title: 'Project Details - Thapa Construction',
  meta: [
    { 
      name: 'description', 
      content: 'View detailed information about our construction project including features, specifications, and gallery.'
    }
  ]
});

// In a real app, this data would come from an API or CMS
// For now, we'll use the same project data from the projects page
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
    details: {
      'Completion': 'March 2023',
      'Area': '8,000 sq ft',
      'Services': 'Architecture & Construction',
      'Duration': '12 months',
      'Special Features': 'Solar panels, Rainwater harvesting'
    }
  },
  // Add more projects as needed - these would ideally be imported from a data file
]);

// Find the project that matches the route ID
const project = computed(() => {
  return projects.value.find(p => p.id === id);
});
</script>