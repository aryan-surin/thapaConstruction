<template>
  <div>
    <!-- Hero Section -->
    <VideoHero />

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

    <!-- FAQs Section -->
    <FAQSection 
      :faqs="limitedFAQs" 
      title="Got Questions? We've Got Answers"
      description="Find quick answers to the most common questions about our construction services."
      background-class="bg-white"
      :show-more-link="true"
      more-link="/contact"
      more-link-text="View All FAQs & Contact Us"
    />

    <!-- Google Reviews Section -->
    <GoogleReviewsSection 
      :limit="4"
      title="Verified Google Reviews"
      description="Real feedback from our valued clients. See why customers trust Thapa Construction for their projects."
      background-class="bg-secondary"
      :show-rating="true"
      :show-cta="true"
      cta-text="Leave Us a Review"
      :min-rating="1"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Home Page - Thapa Construction
 * 
 * This is the landing page showcasing:
 * - Hero slider with main company messaging
 * - About section with company overview and key features
 * - Client testimonials for social proof
 * - FAQs section for quick answers
 * 
 * For detailed information, users can navigate to:
 * - /about - Full company story, vision, mission, and values
 * - /services - Complete services catalog
 * - /projects - Portfolio of completed projects
 * - /contact - Contact form and company information
 */

import { allFAQs, getLimitedFAQs } from '~/data/faqs';

// SEO Configuration
useHead({
  title: 'Thapa Construction - Premier Construction Services in Darjeeling',
  meta: [
    { 
      name: 'description', 
      content: 'Thapa Construction - Excellence in construction since 2024. We deliver high-quality construction services in Darjeeling and Jalpiguri districts with a commitment to quality, reliability, and client satisfaction.' 
    }
  ]
});

/**
 * Client Testimonials Data
 * 
 * Hardcoded testimonials showcasing client satisfaction and social proof.
 * Each testimonial includes client name, role, testimonial content, and image.
 * 
 * @type {Array<{name: string, role: string, content: string, image: string}>}
 */
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

/**
 * Limited FAQs for Home Page
 * 
 * Displays only the first 4 most important FAQs on the home page.
 * Users can view all FAQs by clicking "View All FAQs & Contact Us" link.
 * 
 * @type {FAQ[]}
 */
const limitedFAQs = getLimitedFAQs(4);
</script>
