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

    <!-- TODO: disable for now Related Projects -->
    <!-- <section class="py-20 bg-secondary">
      <div class="container mx-auto max-w-7xl px-4">
        <h2 class="text-3xl font-bold text-primary mb-8 text-center">Other Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </section> -->

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
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useProjectsStore } from '~/stores/projects'

  /**
   * Individual Project Page Logic
   * - Fetches the project by ID from the Pinia store.
   * - Handles not-found and loading states.
   * - Optimized for maintainability and scalability.
   */

  // Initialize Pinia store
  const projectsStore = useProjectsStore()

  // Get the route parameter (project ID)
  const route = useRoute()
  const id: string = route.params.id as string

  // Find the project that matches the route ID using the store
  const project = computed(() => projectsStore.allProjects.find(p => p.id === id))

  // Related projects: same category, excluding current project, max 3
  const relatedProjects = computed(() =>
    projectsStore.allProjects
      .filter(p => p.category === project.value?.category && p.id !== id)
      .slice(0, 3)
  )

  // SEO: Dynamic title and description
  useHead(() => ({
    title: project.value
      ? `${project.value.title} - Thapa Construction`
      : 'Project Details - Thapa Construction',
    meta: [
      {
        name: 'description',
        content:
          project.value?.description ||
          'View detailed information about our construction project including features, specifications, and gallery.'
      }
    ]
  }))
</script>