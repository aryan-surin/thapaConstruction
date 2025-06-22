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
                  <p class="text-neutral">123 Mountain View Road,</p>
                  <p class="text-neutral">Dist-Darjeeling, West Bengal, India</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-primary/10 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:phone" class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 class="font-bold text-primary mb-1">Phone</h4>
                  <p class="text-neutral">+91 98XXXXXXXX (Main Office)</p>
                  <p class="text-neutral">+91 97XXXXXXXX (Customer Support)</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-primary/10 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:envelope" class="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 class="font-bold text-primary mb-1">Email</h4>
                  <p class="text-neutral">info@thapaconstruction.com</p>
                  <p class="text-neutral">support@thapaconstruction.com</p>
                </div>
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
    <section class="py-20 bg-secondary">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Our Location</h2>
          <p class="text-neutral">
            Visit our office in Darjeeling, West Bengal. We're centrally located and easy to find.
          </p>
        </div>

        <!-- Map Placeholder - In production, replace with actual Google Maps embed -->
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
    </section>

    <!-- FAQs Section -->
    <section class="py-20">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Frequently Asked Questions</h2>
          <p class="text-neutral">
            Find answers to common questions about our construction services below.
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div v-for="(faq, index) in faqs" :key="index" class="mb-4 border border-neutral/10 rounded-lg overflow-hidden">
            <button 
              class="w-full px-6 py-4 bg-white text-left flex justify-between items-center text-primary font-medium hover:bg-secondary transition-colors duration-300"
              @click="toggleFAQ(index)"
            >
              {{ faq.question }}
              <Icon 
                :name="activeFAQ === index ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                class="w-5 h-5 transition-transform duration-300"
              />
            </button>
            <div 
              v-show="activeFAQ === index"
              class="px-6 py-4 bg-white border-t border-neutral/10 text-neutral"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

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
          <a href="mailto:info@thapaconstruction.com" class="btn border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
            <Icon name="heroicons:envelope" class="w-5 h-5 mr-2" />
            Email Us
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
 * Frequently Asked Questions data
 */
const faqs = ref([
  {
    question: 'What areas do you serve?',
    answer: 'We primarily serve Darjeeling district and surrounding areas in West Bengal, including Kalimpong, Kurseong, and Siliguri. For larger projects, we may consider locations throughout North Bengal.'
  },
  {
    question: 'How do I get a quote for my construction project?',
    answer: 'You can request a quote by filling out our contact form, calling our office directly, or sending us an email with project details. We typically respond within 24-48 hours to schedule a consultation.'
  },
  {
    question: 'What types of projects do you handle?',
    answer: 'We handle a wide range of construction projects including residential homes, commercial buildings, renovations, remodeling, architectural design, and interior design. No project is too small or too large for our team.'
  },
  {
    question: 'How long does a typical construction project take?',
    answer: 'Project timelines vary significantly based on scope, complexity, and size. A small renovation might take a few weeks, while a custom home could take 6-12 months. During consultation, we provide a detailed timeline specific to your project.'
  },
  {
    question: 'Do you provide warranties for your construction work?',
    answer: 'Yes, we provide warranties for our construction work. The specific terms and duration vary by project type, but typically include a 1-year workmanship warranty and pass-through warranties from material manufacturers.'
  },
  {
    question: 'Can you help with obtaining construction permits?',
    answer: 'Yes, we assist with the permit application process as part of our services. Our team is familiar with local building codes and regulations in Darjeeling and surrounding areas.'
  }
]);

/**
 * Tracks the currently active (expanded) FAQ
 */
const activeFAQ = ref<number | null>(null);

/**
 * Toggles the visibility of FAQ answers
 * @param index - The index of the FAQ to toggle
 */
const toggleFAQ = (index: number) => {
  activeFAQ.value = activeFAQ.value === index ? null : index;
};
</script>
