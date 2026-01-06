<template>
  <div>
    <!-- Hero -->
    <Hero
      backgroundImage="/images/contact-hero.jpg"
      title="Contact Us"
      description="Get in touch with our team to discuss your construction needs and how we can help bring your vision to life."
      primaryButtonText="Call Now"
      primaryButtonLink="tel:+919800000000"
    />

    <!-- Contact Info & Form -->
    <section class="py-20">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Info -->
          <div>
            <h2 class="section-title">Get In Touch</h2>
            <p class="text-neutral mb-8">
              We're here to answer any questions you may have about our construction services. 
              Reach out to us through any of the methods below, and we'll get back to you as soon as possible.
            </p>
            
            <div class="space-y-6 mb-8">
              <div class="flex items-start">
                <div class="bg-primary/10 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:map-pin" class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 class="font-bold text-primary mb-1">Our Office</h4>
                  <p class="text-neutral">Panchanadi, Dagapur, Darjeeling</p>
                  <p class="text-neutral">P.O. Pradhan Nagar(734003)</p>
                  <p class="text-neutral">Dist-Darjeeling, West Bengal, India</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-primary/10 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:phone" class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 class="font-bold text-primary mb-1">Phone</h4>
                  <p class="text-neutral">+91 99072 00490</p>
                  <!-- <p class="text-neutral">+91 97XXXXXXXX (Customer Support)</p> -->
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-primary/10 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:envelope" class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 class="font-bold text-primary mb-1">Email</h4>
                  <p class="text-neutral">thapaconstruction2024@gmail.com</p>
                  <!-- <p class="text-neutral">support@thapaconstruction.com</p> -->
                </div>
              </div>
              <div class="flex items-start mt-2">
                <a
                  href="https://wa.me/919907200490"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with us on WhatsApp"
                  class="flex items-start group"
                  @click="handleWhatsAppClick"
                >
                  <div class="bg-primary/10 p-3 rounded-lg mr-4">
                    <Icon name="mdi:whatsapp" class="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 class="font-bold text-primary mb-1">WhatsApp</h4>
                    <p class="text-neutral hover:underline group-hover:text-green-700 transition-colors duration-200">
                      Chat with us on WhatsApp
                    </p>
                    <p class="text-xs text-neutral/60">+91 99072 00490</p>
                  </div>
                </a>
              </div>
              <div class="flex items-start">
                <div class="bg-primary/10 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:clock" class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 class="font-bold text-primary mb-1">Working Hours</h4>
                  <p class="text-neutral">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p class="text-neutral">Saturday: 9:00 AM - 1:00 PM</p>
                  <p class="text-neutral">Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            <!-- Social Media -->
            <div>
              <h4 class="font-bold text-primary mb-4">Connect With Us</h4>
              <div class="flex space-x-4">
                <a href="#" class="bg-primary/10 p-3 rounded-full hover:bg-accent hover:text-primary transition-all duration-300">
                  <Icon name="mdi:facebook" class="w-6 h-6" />
                </a>
                <a href="#" class="bg-primary/10 p-3 rounded-full hover:bg-accent hover:text-primary transition-all duration-300">
                  <Icon name="mdi:twitter" class="w-6 h-6" />
                </a>
                <a href="#" class="bg-primary/10 p-3 rounded-full hover:bg-accent hover:text-primary transition-all duration-300">
                  <Icon name="mdi:instagram" class="w-6 h-6" />
                </a>
                <a href="#" class="bg-primary/10 p-3 rounded-full hover:bg-accent hover:text-primary transition-all duration-300">
                  <Icon name="mdi:linkedin" class="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          
          <!-- Contact Form -->
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <h3 class="text-2xl font-bold text-primary mb-6">Send Us a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <!-- TODO: will implement Google Maps integration later -->
    <!-- <section class="py-20 bg-secondary">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Our Location</h2>
          <p class="text-neutral">
            Visit our office in Darjeeling, West Bengal. We're centrally located and easy to find.
          </p>
        </div>

        <div class="w-full h-[500px] bg-white rounded-lg shadow-md overflow-hidden">
          <div class="w-full h-full bg-neutral/10 flex items-center justify-center">
            <div class="text-center">
              <Icon name="heroicons:map" class="w-16 h-16 text-neutral/30 mx-auto mb-4" />
              <h3 class="text-xl font-semibold text-primary mb-2">Google Maps Integration</h3>
              <p class="text-neutral max-w-md mx-auto">
                In the production environment, a Google Maps iframe would be embedded here showing 
                the location of Thapa Construction in Darjeeling, West Bengal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- FAQs Section -->
    <FAQSection :faqs="allFAQs" background-class="bg-white" />

    <!-- Google Reviews Section -->
    <GoogleReviewsSection 
      title="What Our Clients Say"
      description="Read reviews from our satisfied clients on Google. Your trust drives our commitment to excellence."
      background-class="bg-secondary"
      :show-rating="true"
      :show-cta="true"
      cta-text="Share Your Experience"
      :min-rating="1"
    />

    <!-- CTA -->
    <section class="py-20 bg-primary text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('/images/cta-bg.jpg')"></div>
      <div class="container-custom relative z-10 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Dream Project?</h2>
        <p class="text-white/90 text-lg max-w-3xl mx-auto mb-8">
          Whether you're planning a new construction, renovation, or seeking architectural design services, 
          Thapa Construction is here to help. Contact us today to get started.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="tel:+919800000000" class="btn bg-accent text-primary hover:bg-white transition-all duration-300">
            <Icon name="heroicons:phone" class="w-5 h-5 mr-2" />
            Call Us Now
          </a>
          <a href="mailto:thapaconstruction2024@gmail.com" class="btn border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
            <Icon name="heroicons:envelope" class="w-5 h-5 mr-2" />
            Email Us
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { allFAQs } from '~/data/faqs';

// SEO
useHead({
  title: 'Contact Us - Thapa Construction',
  meta: [
    { 
      name: 'description', 
      content: 'Contact Thapa Construction for your construction needs in Darjeeling, West Bengal. Reach us for residential and commercial construction, renovation, design, and more.' 
    }
  ]
});

/**
 * Handles WhatsApp link click event
 * Logs the interaction for monitoring purposes
 */
const handleWhatsAppClick = (): void => {
  // Logging for debugging/monitoring
  // eslint-disable-next-line no-console
  console.log('WhatsApp chat link clicked');
};
</script>
