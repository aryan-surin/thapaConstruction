<template>
  <footer class="bg-primary text-white pt-16 pb-8">
    <div class="container-custom">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div>
          <img src="/images/logo.jpg" alt="Thapa Construction" class="h-16 w-auto mb-4 bg-white p-2 rounded">
          <p class="text-secondary/80 mt-4">
            Premier construction services in Darjeeling, West Bengal. Building dreams with quality and reliability since 2024.
          </p>
          <div class="flex space-x-4 mt-6">
            <a href="#" class="text-white hover:text-accent transition-colors duration-300" aria-label="Facebook">
              <Icon name="mdi:facebook" class="w-6 h-6" />
            </a>
            <a href="#" class="text-white hover:text-accent transition-colors duration-300" aria-label="Instagram">
              <Icon name="mdi:instagram" class="w-6 h-6" />
            </a>
            <a href="#" class="text-white hover:text-accent transition-colors duration-300" aria-label="Twitter">
              <Icon name="mdi:twitter" class="w-6 h-6" />
            </a>
            <a href="#" class="text-white hover:text-accent transition-colors duration-300" aria-label="LinkedIn">
              <Icon name="mdi:linkedin" class="w-6 h-6" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-xl font-semibold mb-6 text-accent">Quick Links</h3>
          <ul class="space-y-3">
            <li><NuxtLink to="/" class="text-secondary/80 hover:text-accent transition-colors duration-300">Home</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-secondary/80 hover:text-accent transition-colors duration-300">About Us</NuxtLink></li>
            <li><NuxtLink to="/services" class="text-secondary/80 hover:text-accent transition-colors duration-300">Our Services</NuxtLink></li>
            <li><NuxtLink to="/projects" class="text-secondary/80 hover:text-accent transition-colors duration-300">Projects</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-secondary/80 hover:text-accent transition-colors duration-300">Contact Us</NuxtLink></li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h3 class="text-xl font-semibold mb-6 text-accent">Our Services</h3>
          <ul class="space-y-3">
            <li><NuxtLink to="/services#general" class="text-secondary/80 hover:text-accent transition-colors duration-300">General Construction</NuxtLink></li>
            <li><NuxtLink to="/services#residential" class="text-secondary/80 hover:text-accent transition-colors duration-300">Residential & Commercial</NuxtLink></li>
            <li><NuxtLink to="/services#renovation" class="text-secondary/80 hover:text-accent transition-colors duration-300">Renovation & Remodeling</NuxtLink></li>
            <li><NuxtLink to="/services#design" class="text-secondary/80 hover:text-accent transition-colors duration-300">Architectural Design</NuxtLink></li>
            <li><NuxtLink to="/services#interior" class="text-secondary/80 hover:text-accent transition-colors duration-300">Interior Design & Roofing</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-xl font-semibold mb-6 text-accent">Contact Us</h3>
          <ul class="space-y-4">
            <li class="flex items-start space-x-3">
              <Icon name="heroicons:map-pin" class="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <span class="text-secondary/80">Dist-Darjeeling, West Bengal, India</span>
            </li>
            <li class="flex items-center space-x-3">
              <Icon name="heroicons:phone" class="w-6 h-6 text-accent flex-shrink-0" />
              <span class="text-secondary/80">+91 98XXXXXXXX</span>
            </li>
            <li class="flex items-center space-x-3">
              <Icon name="heroicons:envelope" class="w-6 h-6 text-accent flex-shrink-0" />
              <span class="text-secondary/80">thapaconstruction2024@gmail.com</span>
            </li>
            <li class="flex items-center space-x-3">
              <Icon name="heroicons:clock" class="w-6 h-6 text-accent flex-shrink-0" />
              <span class="text-secondary/80">Mon-Sat: 9:00 AM - 6:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="mt-12 pt-8 border-t border-white/10 text-center">
        <p class="text-secondary/70 text-sm">
          © {{ new Date().getFullYear() }} Thapa Construction. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
