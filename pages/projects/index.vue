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
  import { ref, computed } from 'vue'
  import { useProjectsStore } from '~/stores/projects'

  // Initialize Pinia store
  const projectsStore = useProjectsStore()

  // Active category for filtering
  const activeCategory = ref('all')

  // Getters from the store
  const categories = computed(() => projectsStore.categories)
  const filteredProjects = computed(() => projectsStore.filteredProjects(activeCategory.value))
  const featuredProject = computed(() => projectsStore.featuredProject)

  // Client companies (can remain local or be moved to a store if reused elsewhere)
  const clients = ref([
    { name: 'Darjeeling Tea Estates', logo: '/images/clients/client1.png' },
    { name: 'Himalaya Hotels', logo: '/images/clients/client2.png' },
    { name: 'Mountain Development Corp', logo: '/images/clients/client3.png' },
    { name: 'West Bengal Government', logo: '/images/clients/client4.png' },
    { name: 'Eastern Realty', logo: '/images/clients/client5.png' },
    { name: 'Siliguri Commercial Group', logo: '/images/clients/client6.png' }
  ])
</script>