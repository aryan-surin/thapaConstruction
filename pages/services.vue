<template>
  <div>
    <!-- Hero -->
    <Hero
      backgroundImage="/images/services-hero.jpg"
      title="Our Services"
      description="Comprehensive construction services tailored to meet your unique needs."
      primaryButtonText="Contact Us"
      primaryButtonLink="/contact"
    />

    <!-- Services Intro -->
    <section class="py-20">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Comprehensive Construction Services</h2>
          <p class="text-neutral">
            At Thapa Construction, we offer a wide range of construction services to meet all your needs. 
            From initial planning and design to completion and beyond, our experienced team is committed 
            to delivering high-quality results that exceed your expectations.
          </p>
        </div>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            v-for="service in services"
            :key="service.id"
            :title="service.title"
            :description="service.description"
            :image="service.image"
            :icon="service.icon"
            :link="service.id"
          />
        </div>
      </div>
    </section>

    <!-- Detailed Services -->
    <section class="py-20 bg-secondary">
      <div class="container-custom">
        <div v-for="service in services" :key="service.id" :id="service.id" class="mb-20 scroll-mt-24">
          <div class="flex flex-col md:flex-row gap-12 items-center">
            <div class="md:w-1/2" :class="{ 'order-1': service.imageRight, 'order-0': !service.imageRight }">
              <img 
                :src="service.detailedImage || service.image" 
                :alt="service.title" 
                class="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div class="md:w-1/2">
              <div class="flex items-center mb-4">
                <Icon :name="service.icon" class="w-8 h-8 text-accent mr-3" />
                <h2 class="text-3xl font-bold text-primary">{{ service.title }}</h2>
              </div>
              <p class="text-neutral mb-6">{{ service.longDescription }}</p>
              
              <h3 class="text-xl font-semibold text-primary mb-4">What We Offer:</h3>
              <ul class="space-y-3">
                <li v-for="(feature, index) in service.features" :key="index" class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-accent mr-2 mt-1 flex-shrink-0" />
                  <span>{{ feature }}</span>
                </li>
              </ul>

              <NuxtLink 
                to="/contact" 
                class="btn-primary inline-flex items-center mt-8"
              >
                Request This Service
                <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="py-20">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Our Process</h2>
          <p class="text-neutral">
            We follow a methodical approach to ensure your project is completed on time, within budget, and to your complete satisfaction.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(step, index) in processSteps" :key="index" class="relative">
            <!-- Step Number -->
            <div class="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-xl z-10">
              {{ index + 1 }}
            </div>
            
            <!-- Step Content -->
            <div class="bg-white p-6 pt-10 rounded-lg shadow-md h-full border border-neutral/10">
              <h3 class="text-xl font-semibold text-primary mb-3">{{ step.title }}</h3>
              <p class="text-neutral">{{ step.description }}</p>
            </div>
            
            <!-- Connector (except for the last item) -->
            <div v-if="index < processSteps.length - 1" class="hidden lg:block absolute top-1/2 -right-4 w-8 h-2 bg-accent"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-secondary">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">What Our Clients Say</h2>
          <p class="text-neutral">
            Don't just take our word for it. Here's what our clients have to say about our services.
          </p>
        </div>

        <!-- Testimonials Carousel -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white p-8 rounded-lg shadow-md relative">
            <div class="absolute -top-4 left-8 text-5xl text-accent opacity-50">"</div>
            <p class="italic text-neutral mb-6 relative z-10">{{ testimonial.content }}</p>
            <div class="flex items-center">
              <img :src="testimonial.image" :alt="testimonial.name" class="w-12 h-12 rounded-full object-cover mr-4">
              <div>
                <h4 class="font-bold text-primary">{{ testimonial.name }}</h4>
                <p class="text-sm text-neutral">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-primary text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('/images/cta-bg.jpg')"></div>
      <div class="container-custom relative z-10 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Construction Project?</h2>
        <p class="text-white/90 text-lg max-w-3xl mx-auto mb-8">
          Contact Thapa Construction today for a free consultation and quote. Let's bring your vision to life together.
        </p>
        <NuxtLink to="/contact" class="btn bg-accent text-primary hover:bg-white transition-all duration-300">
          Get a Free Quote
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { services } from '~/data/services';

// SEO
useHead({
  title: 'Construction Services - Thapa Construction',
  meta: [
    { 
      name: 'description', 
      content: 'Thapa Construction offers comprehensive construction services in Darjeeling including general construction, renovation, remodeling, architectural design, interior design, roofing, and more.' 
    }
  ]
});

/**
 * Process steps that outline the company's methodology
 */
const processSteps = ref([
  {
    title: 'Consultation',
    description: 'We start by understanding your vision, requirements, and budget to create a personalized plan.'
  },
  {
    title: 'Design & Planning',
    description: 'Our experts create detailed designs and plans, ensuring all aspects of your project are considered.'
  },
  {
    title: 'Construction',
    description: 'Our skilled team brings your vision to life with quality materials and craftsmanship.'
  },
  {
    title: 'Completion & Handover',
    description: 'We ensure your complete satisfaction before finalizing the project and providing all necessary documentation.'
  }
]);

/**
 * Testimonials from satisfied clients
 */
const testimonials = ref([
  {
    name: 'Rajesh Kumar',
    role: 'Homeowner',
    content: `We hired Thapa Construction for our home renovation, and they exceeded our expectations. The team was professional, and the quality of work was outstanding.`,
    image: '/images/testimonials/person1.jpg'
  },
  {
    name: 'Priya Sharma',
    role: 'Business Owner',
    content: `The architectural design services provided by Thapa Construction for our office building were exceptional. They perfectly captured our vision and delivered on time.`,
    image: '/images/testimonials/person2.jpg'
  },
  {
    name: 'Anand Thapa',
    role: 'Resort Owner',
    content: `From project management to the final construction, Thapa Construction handled everything with utmost professionalism. I highly recommend their services.`,
    image: '/images/testimonials/person3.jpg'
  }
]);
</script>
