<template>
  <div>
    <!-- Hero -->
    <Hero
      backgroundImage="/images/about-hero.jpg"
      title="About Thapa Construction"
      description="Learn about our company, our values, and our commitment to excellence in construction."
      primaryButtonText="Contact Us"
      primaryButtonLink="/contact"
    />

    <!-- Company Story -->
 <div class="container-custom">
  <!-- Company Story Section with enhanced visual hierarchy -->
  <div class="flex flex-col lg:flex-row gap-12 items-center">
    <div class="lg:w-1/2">
      <!-- Tagline with visual emphasis -->
      <h2 class="section-title mb-3">Our Story</h2>
      <div class="inline-block px-4 py-2 bg-accent/10 rounded-full mb-6">
        <p class="text-accent font-medium flex items-center">
          <Icon name="heroicons:sparkles" class="w-5 h-5 mr-2" />
          Building Your Dreams into a Reality
        </p>
      </div>
      
      <!-- Company history with improved typography and spacing -->
      <p class="text-neutral mb-6">
        Thapa Construction is a full-service construction and design company based in Siliguri, West Bengal, offering end-to-end solutions for residential, commercial, and interior projects.
      </p>
      
      <p class="text-neutral mb-6">
        Founded in 2022 as a subcontracting firm, and officially established as a full-contract construction company in 2024, we have consistently delivered reliable, high-quality, and value-driven construction services across North Bengal. Our growth has been built on strong foundations of trust, transparency, and technical excellence.
      </p>

      <!-- Leadership with visual separator -->
      <div class="border-l-4 border-accent pl-4 mb-6">
        <h3 class="text-xl font-bold text-primary mb-2">Leadership & Vision</h3>
        <p class="text-neutral">
          Under the leadership of Mr. Shahil Thapa, our company operates with a clear vision — to deliver construction services that reflect integrity, innovation, and a commitment to excellence. Every project is handled with utmost professionalism and attention to detail, ensuring timely delivery and complete client satisfaction.
        </p>
      </div>

      <!-- Regional presence with map icon -->
      <div class="flex items-start">
        <div class="bg-primary/10 p-2 rounded-lg mr-3 mt-1">
          <Icon name="heroicons:map-pin" class="w-5 h-5 text-accent" />
        </div>
        <p class="text-neutral">
          Strategically located in Siliguri, West Bengal, we serve clients across the region — from small residential works to large-scale commercial developments. Whether you're building a home, a workspace, or planning an interior renovation, we're here to help bring your vision to life.
        </p>
      </div>
    </div>
    
    <!-- Image section with optional enhancements -->
    <div class="lg:w-1/2 relative">
      <img 
        src="/images/about-story.jpg" 
        alt="Thapa Construction - Building Your Dreams into Reality" 
        class="rounded-lg shadow-lg w-full h-auto"
        loading="lazy"
      />
      <!-- Decorative element -->
      <div class="absolute -bottom-4 -left-4 w-24 h-24 border-8 border-accent/30 rounded-lg hidden lg:block"></div>
    </div>
  </div>

  <!-- Services grid with icons - New addition -->
  <div class="mt-16">
    <h3 class="text-2xl font-bold text-primary mb-8">Services We Provide</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Service 1 -->
      <div class="bg-secondary p-6 rounded-lg flex items-start hover:shadow-md transition-shadow">
        <div class="bg-accent/10 p-3 rounded-full mr-4">
          <Icon name="heroicons:building-office-2" class="w-6 h-6 text-accent" />
        </div>
        <div>
          <h4 class="font-bold text-primary mb-1">Residential & Commercial Construction</h4>
          <p class="text-sm text-neutral">Custom building solutions for homes and businesses</p>
        </div>
      </div>

      <!-- Service 2 -->
      <div class="bg-secondary p-6 rounded-lg flex items-start hover:shadow-md transition-shadow">
        <div class="bg-accent/10 p-3 rounded-full mr-4">
          <Icon name="heroicons:wrench-screwdriver" class="w-6 h-6 text-accent" />
        </div>
        <div>
          <h4 class="font-bold text-primary mb-1">Renovation & Structural Repair</h4>
          <p class="text-sm text-neutral">Revitalize and strengthen existing structures</p>
        </div>
      </div>

      <!-- Service 3 -->
      <div class="bg-secondary p-6 rounded-lg flex items-start hover:shadow-md transition-shadow">
        <div class="bg-accent/10 p-3 rounded-full mr-4">
          <Icon name="heroicons:cube" class="w-6 h-6 text-accent" />
        </div>
        <div>
          <h4 class="font-bold text-primary mb-1">Interior Design & Planning</h4>
          <p class="text-sm text-neutral">Transform spaces with expert design solutions</p>
        </div>
      </div>

      <!-- Service 4 -->
      <div class="bg-secondary p-6 rounded-lg flex items-start hover:shadow-md transition-shadow">
        <div class="bg-accent/10 p-3 rounded-full mr-4">
          <Icon name="heroicons:home" class="w-6 h-6 text-accent" />
        </div>
        <div>
          <h4 class="font-bold text-primary mb-1">Roofing Solutions</h4>
          <p class="text-sm text-neutral">Durable and aesthetic roofing for all structures</p>
        </div>
      </div>

      <!-- Service 5 -->
      <div class="bg-secondary p-6 rounded-lg flex items-start hover:shadow-md transition-shadow">
        <div class="bg-accent/10 p-3 rounded-full mr-4">
          <Icon name="heroicons:wrench" class="w-6 h-6 text-accent" />
        </div>
        <div>
          <h4 class="font-bold text-primary mb-1">Grill Fabrication & Metal Works</h4>
          <p class="text-sm text-neutral">Custom metal solutions for security and aesthetics</p>
        </div>
      </div>

      <!-- Service 6 -->
      <div class="bg-secondary p-6 rounded-lg flex items-start hover:shadow-md transition-shadow">
        <div class="bg-accent/10 p-3 rounded-full mr-4">
          <Icon name="heroicons:paint-brush" class="w-6 h-6 text-accent" />
        </div>
        <div>
          <h4 class="font-bold text-primary mb-1">Flooring, Tiling & Painting</h4>
          <p class="text-sm text-neutral">Professional finishing touches for any space</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Team highlight - brief mention -->
  <div class="mt-12 bg-primary/5 p-6 rounded-lg">
    <div class="flex items-center mb-4">
      <Icon name="heroicons:user-group" class="w-6 h-6 text-accent mr-3" />
      <h3 class="text-xl font-bold text-primary">Our Expert Team</h3>
    </div>
    <p class="text-neutral">
      With a strong team of engineers, skilled professionals, and creative designers, we ensure precision, durability, and aesthetic value in every project. Our collaborative approach brings together diverse expertise to deliver exceptional results.
    </p>
  </div>
</div>

    <!-- Vision & Mission -->
    <section class="py-20 bg-secondary">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                <Icon name="heroicons:eye" class="w-6 h-6 text-accent" />
              </div>
              <h2 class="text-2xl font-bold text-primary">Our Vision</h2>
            </div>
            <p class="text-neutral">
              To be the most trusted and respected construction company in the Darjeeling region, known for our unwavering commitment to quality, innovation, and customer satisfaction. We aim to build structures that stand the test of time while positively impacting the communities we serve.
            </p>
          </div>

          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                <Icon name="heroicons:flag" class="w-6 h-6 text-accent" />
              </div>
              <h2 class="text-2xl font-bold text-primary">Our Mission</h2>
            </div>
            <p class="text-neutral">
              To deliver exceptional construction services that exceed client expectations through attention to detail, technical excellence, and ethical business practices. We are committed to using sustainable building methods, providing a safe working environment, and creating long-lasting value for our clients and community.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="py-20">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Our Core Values</h2>
          <p class="text-neutral">
            These principles guide every project we undertake and every relationship we build.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:star" class="w-8 h-8 text-accent" />
            </div>
            <h3 class="text-xl font-bold text-primary mb-3">Excellence</h3>
            <p class="text-neutral">
              We strive for excellence in every aspect of our work, from planning to execution.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:heart" class="w-8 h-8 text-accent" />
            </div>
            <h3 class="text-xl font-bold text-primary mb-3">Integrity</h3>
            <p class="text-neutral">
              We conduct business with honesty, transparency, and ethical standards.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:user-group" class="w-8 h-8 text-accent" />
            </div>
            <h3 class="text-xl font-bold text-primary mb-3">Teamwork</h3>
            <p class="text-neutral">
              We value collaboration, respect, and the diverse skills our team brings.
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:light-bulb" class="w-8 h-8 text-accent" />
            </div>
            <h3 class="text-xl font-bold text-primary mb-3">Innovation</h3>
            <p class="text-neutral">
              We embrace new ideas and technologies to deliver better solutions.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- TODO: will active this section later Meet the Team -->
    <!-- <section class="py-20 bg-secondary">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">Meet Our Leadership</h2>
          <p class="text-neutral">
            The experienced team behind Thapa Construction's success.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="relative">
              <img 
                src="/images/team/team1.jpg" 
                alt="Prakash Thapa" 
                class="w-full h-72 object-cover object-center"
              />
            </div>
            <div class="p-6 text-center">
              <h3 class="text-xl font-bold text-primary mb-1">Prakash Thapa</h3>
              <p class="text-accent mb-3">Founder & CEO</p>
              <p class="text-neutral mb-4">
                With over 30 years of construction experience, Prakash leads our company with vision and expertise.
              </p>
              <div class="flex justify-center space-x-3">
                <a href="#" class="text-neutral hover:text-steel-blue transition-colors duration-300">
                  <Icon name="mdi:linkedin" class="w-5 h-5" />
                </a>
                <a href="#" class="text-neutral hover:text-steel-blue transition-colors duration-300">
                  <Icon name="mdi:email" class="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="relative">
              <img 
                src="/images/team/team2.jpg" 
                alt="Anita Thapa" 
                class="w-full h-72 object-cover object-center"
              />
            </div>
            <div class="p-6 text-center">
              <h3 class="text-xl font-bold text-primary mb-1">Anita Thapa</h3>
              <p class="text-accent mb-3">Operations Director</p>
              <p class="text-neutral mb-4">
                Anita oversees our day-to-day operations, ensuring projects run smoothly and efficiently.
              </p>
              <div class="flex justify-center space-x-3">
                <a href="#" class="text-neutral hover:text-steel-blue transition-colors duration-300">
                  <Icon name="mdi:linkedin" class="w-5 h-5" />
                </a>
                <a href="#" class="text-neutral hover:text-steel-blue transition-colors duration-300">
                  <Icon name="mdi:email" class="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="relative">
              <img 
                src="/images/team/team3.jpg" 
                alt="Suresh Pradhan" 
                class="w-full h-72 object-cover object-center"
              />
            </div>
            <div class="p-6 text-center">
              <h3 class="text-xl font-bold text-primary mb-1">Suresh Pradhan</h3>
              <p class="text-accent mb-3">Lead Architect</p>
              <p class="text-neutral mb-4">
                Suresh brings creative design solutions that blend functionality with aesthetic excellence.
              </p>
              <div class="flex justify-center space-x-3">
                <a href="#" class="text-neutral hover:text-steel-blue transition-colors duration-300">
                  <Icon name="mdi:linkedin" class="w-5 h-5" />
                </a>
                <a href="#" class="text-neutral hover:text-steel-blue transition-colors duration-300">
                  <Icon name="mdi:email" class="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Why Choose Us -->
    <section class="py-20">
      <div class="container-custom">
        <div class="flex flex-col lg:flex-row gap-12 items-center">
          <div class="lg:w-1/2">
            <h2 class="section-title">Why Choose Thapa Construction?</h2>
            <p class="text-neutral mb-6">
              When you choose Thapa Construction for your project, you're choosing a partner committed to excellence at every step of the journey.
            </p>
            
            <div class="space-y-6">
              <div class="flex">
                <div class="mr-4 flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Icon name="heroicons:check" class="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-primary mb-2">Local Expertise</h3>
                  <p class="text-neutral">
                    With deep roots in Darjeeling, we understand the unique challenges and opportunities of building in our region.
                  </p>
                </div>
              </div>

              <div class="flex">
                <div class="mr-4 flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Icon name="heroicons:check" class="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-primary mb-2">Quality Craftsmanship</h3>
                  <p class="text-neutral">
                    We don't cut corners. Our attention to detail ensures lasting quality in every project.
                  </p>
                </div>
              </div>

              <div class="flex">
                <div class="mr-4 flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Icon name="heroicons:check" class="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-primary mb-2">Comprehensive Services</h3>
                  <p class="text-neutral">
                    From design to completion, we offer end-to-end solutions for all your construction needs.
                  </p>
                </div>
              </div>

              <div class="flex">
                <div class="mr-4 flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Icon name="heroicons:check" class="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-primary mb-2">Client-Centered Approach</h3>
                  <p class="text-neutral">
                    We listen to your needs and keep you informed throughout the project journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:w-1/2">
            <img 
              src="/images/why-choose-us.jpg" 
              alt="Why Choose Thapa Construction" 
              class="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-primary text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('/images/cta-bg.jpg')"></div>
      <div class="container-custom relative z-10 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Construction Journey?</h2>
        <p class="text-white/90 text-lg max-w-3xl mx-auto mb-8">
          Let Thapa Construction turn your vision into reality. Contact us today to discuss your project needs and get a free consultation.
        </p>
        <NuxtLink to="/contact" class="btn bg-accent text-primary hover:bg-white transition-all duration-300">
          Contact Us Today
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'About Us - Thapa Construction',
  meta: [
    { 
      name: 'description', 
      content: 'Learn about Thapa Construction - a premier construction company in Darjeeling, West Bengal, known for its commitment to quality, transparency, and client satisfaction in residential and commercial projects.'
    }
  ]
});
</script>
