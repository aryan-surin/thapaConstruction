<template>
  <div>
    <!-- Hero Section -->
    <SliderHero />

    <!-- About Section -->
    <section class="py-20 bg-secondary">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="w-full md:w-1/2">
            <img src="/images/about-home.jpg" alt="About Thapa Construction" class="rounded-lg shadow-lg w-full h-auto">
          </div>
          <div class="w-full md:w-1/2">
            <h2 class="section-title">Excellence in Construction Since 2024</h2>
            <p class="text-neutral mb-6">
              Thapa Construction blends modern techniques with a skilled team to create inspiring spaces in Darjeeling and Jalpiguri districts and beyond. We work closely with our clients to turn their vision into reality, ensuring reliability and excellence at every step.
            </p>
            <p class="text-neutral mb-8">
              With our team of experienced professionals, we deliver high-quality construction services that meet and exceed client expectations. Our commitment to quality, reliability, and client satisfaction is what sets us apart.
            </p>
            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="flex items-center">
                <Icon name="heroicons:shield-check" class="w-10 h-10 text-accent mr-3" />
                <div>
                  <h4 class="font-semibold">Quality Guaranteed</h4>
                </div>
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:clock" class="w-10 h-10 text-accent mr-3" />
                <div>
                  <h4 class="font-semibold">On-Time Delivery</h4>
                </div>
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:user-group" class="w-10 h-10 text-accent mr-3" />
                <div>
                  <h4 class="font-semibold">Expert Team</h4>
                </div>
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:banknotes" class="w-10 h-10 text-accent mr-3" />
                <div>
                  <h4 class="font-semibold">Competitive Pricing</h4>
                </div>
              </div>
            </div>
            <NuxtLink to="/about" class="btn-primary">
              Learn More About Us
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-20">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Our Services</h2>
          <p class="text-neutral">
            We offer a comprehensive range of construction services to meet your needs, from initial design to final construction.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            v-for="(service, index) in services"
            :key="index"
            :title="service.title"
            :description="service.description"
            :image="service.image"
            :icon="service.icon"
            :link="service.link"
          />
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/services" class="btn-outline">
            View All Services
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('/images/cta-bg.jpg')"></div>
      <div class="container-custom relative z-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="md:w-2/3">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Construction Project?</h2>
            <p class="text-white/90 text-lg">
              Contact us today for a free consultation and quote. We're ready to bring your vision to life.
            </p>
          </div>
          <div class="md:w-1/3 flex justify-center md:justify-end">
            <NuxtLink to="/contact" class="btn bg-accent text-primary hover:bg-white transition-all duration-300">
              Get Free Quote
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="py-20">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Our Featured Projects</h2>
          <p class="text-neutral">
            Explore some of our recent construction projects showcasing our quality and craftsmanship.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard
            v-for="(project, index) in featuredProjects"
            :key="index"
            :title="project.title"
            :description="project.description"
            :category="project.category"
            :location="project.location"
            :image="project.image"
            :link="project.link"
          />
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/projects" class="btn-outline">
            View All Projects
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-secondary">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">What Our Clients Say</h2>
          <p class="text-neutral">
            Don't just take our word for it. Here's what our clients have to say about our work.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

    <!-- Contact Section -->
    <section class="py-20">
      <div class="container-custom">
        <div class="flex flex-col lg:flex-row gap-12">
          <div class="lg:w-1/2">
            <h2 class="section-title">Get In Touch</h2>
            <p class="text-neutral mb-8">
              Have a question or ready to start your next construction project? Contact us today and our team will get back to you as soon as possible.
            </p>
            <div class="space-y-6">
              <div class="flex items-center">
                <div class="bg-primary/10 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:map-pin" class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 class="font-bold text-primary">Our Location</h4>
                  <p class="text-neutral">Dist-Darjeeling, West Bengal, India</p>
                </div>
              </div>
              
              <div class="flex items-center">
                <div class="bg-primary/10 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:phone" class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 class="font-bold text-primary">Call Us</h4>
                  <p class="text-neutral">+91 98XXXXXXXX</p>
                </div>
              </div>

              <div class="flex items-center">
                <div class="bg-primary/10 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:envelope" class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 class="font-bold text-primary">Email Us</h4>
                  <p class="text-neutral">thapaconstruction2024@gmail.com</p>
                </div>
              </div>

              <div class="flex items-center">
                <div class="bg-primary/10 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:clock" class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 class="font-bold text-primary">Working Hours</h4>
                  <p class="text-neutral">Mon-Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:w-1/2">
            <div class="bg-white p-8 rounded-lg shadow-lg">
              <h3 class="text-2xl font-bold mb-6 text-primary">Send Us a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import SliderHero from '~/components/SliderHero.vue';

useHead({
  title: 'Thapa Construction - Premier Construction Services in Darjeeling',
  meta: [
    { 
      name: 'description', 
      content: 'Thapa Construction offers professional construction services in Darjeeling, West Bengal including residential, commercial, renovation, and architectural design.' 
    }
  ]
});

// Sample data - would typically come from an API or CMS
const services = [
  {
    title: 'General Construction',
    description: 'Full-service construction solutions for both residential and commercial projects, built to the highest standards.',
    image: '/images/services/general-construction.jpg',
    icon: 'heroicons:building-office-2',
    link: '/services#general'
  },
  {
    title: 'Residential & Commercial',
    description: 'Custom home building and commercial construction services tailored to meet your specific needs and vision.',
    image: '/images/services/residential-commercial.jpg',
    icon: 'heroicons:home',
    link: '/services#residential'
  },
  {
    title: 'Renovation & Remodeling',
    description: 'Transform your existing space with our comprehensive renovation and remodeling services.',
    image: '/images/services/renovation-remodeling.jpg',
    icon: 'heroicons:wrench-screwdriver',
    link: '/services#renovation'
  }
];

const featuredProjects = [
  {
    title: 'Himalayan Heights Residences',
    description: 'Luxury residential complex with stunning mountain views and modern amenities.',
    category: 'Residential',
    location: 'Darjeeling',
    image: '/images/projects/residential-1.jpg',
    link: '/projects/himalayan-heights'
  },
  {
    title: 'Tea Estate Office Complex',
    description: 'Modern office building for a prominent tea estate featuring sustainable design elements.',
    category: 'Commercial',
    location: 'Kurseong',
    image: '/images/projects/commercial-1.jpg',
    link: '/projects/tea-estate-office'
  },
  {
    title: 'Heritage Villa Restoration',
    description: 'Complete restoration of a 100-year-old colonial villa preserving historical elements while adding modern amenities.',
    category: 'Renovation',
    location: 'Darjeeling',
    image: '/images/projects/renovation-1.jpg',
    link: '/projects/heritage-villa'
  }
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Homeowner',
    content: 'Thapa Construction built our dream home with exceptional attention to detail. Their team was professional, and they completed the project on time and within budget.',
    image: '/images/testimonials/person1.jpg'
  },
  {
    name: 'Priya Sharma',
    role: 'Business Owner',
    content: 'We hired Thapa Construction for our restaurant renovation and the results were outstanding. Their expertise and quality craftsmanship transformed our space completely.',
    image: '/images/testimonials/person2.jpg'
  },
  {
    name: 'Anand Thapa',
    role: 'Resort Owner',
    content: 'The architectural design and construction quality provided by Thapa Construction for our mountain resort was excellent. They understood our vision perfectly.',
    image: '/images/testimonials/person3.jpg'
  }
];
</script>
