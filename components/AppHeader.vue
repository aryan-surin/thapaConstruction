<template>
  <header class="fixed top-0 w-full z-50 bg-white shadow-md transition-all duration-300" :class="{'py-1': scrolled, 'py-3': !scrolled}">
    <div class="container-custom flex justify-between items-center">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-4">
        <img src="/images/logo.jpg" alt="Thapa Construction" class="h-12 md:h-16 w-auto transition-all duration-300" :class="{'h-10 md:h-12': scrolled}">
        <span class="hidden md:block text-xl font-bold text-primary">Thapa <span class="text-accent">Construction</span></span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center space-x-8">
        <NuxtLink v-for="(item, index) in navItems" :key="index" :to="item.path" class="nav-link text-base font-medium">
          {{ item.name }}
        </NuxtLink>
        <NuxtLink to="/contact" class="btn-primary text-sm">
          Get a Quote
        </NuxtLink>
      </nav>

      <!-- Mobile Navigation Toggle -->
      <button @click="isMenuOpen = !isMenuOpen" class="lg:hidden p-2 rounded-md text-neutral hover:text-steel-blue">
        <Icon v-if="!isMenuOpen" name="heroicons:bars-3" class="w-7 h-7" />
        <Icon v-else name="heroicons:x-mark" class="w-7 h-7" />
      </button>
    </div>

    <!-- Mobile Navigation Menu -->
    <div v-show="isMenuOpen" class="lg:hidden absolute top-full left-0 right-0 bg-white shadow-md border-t border-neutral/10 py-4">
      <div class="container-custom flex flex-col space-y-4">
        <NuxtLink 
          v-for="(item, index) in navItems" 
          :key="index" 
          :to="item.path" 
          class="nav-link py-2 px-4 hover:bg-secondary rounded-md"
          @click="isMenuOpen = false"
        >
          {{ item.name }}
        </NuxtLink>
        <NuxtLink 
          to="/contact" 
          class="btn-primary text-center mt-2"
          @click="isMenuOpen = false"
        >
          Get a Quote
        </NuxtLink>
      </div>
    </div>
  </header>
  <div :class="{'h-24': !scrolled, 'h-16': scrolled}"></div>
</template>

<script setup lang="ts">
const isMenuOpen = ref(false);
const scrolled = ref(false);

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
];

// Handle scroll event to change header style
onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 50;
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
  
  // Clean up event listener
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (isMenuOpen.value && !target.closest('header')) {
      isMenuOpen.value = false;
    }
  };
  window.addEventListener('click', handleClickOutside);
  
  // Clean up event listener
  onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
  });
});
</script>
