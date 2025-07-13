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
      <button 
        @click="toggleMenu" 
        class="lg:hidden p-2 rounded-md text-neutral hover:text-steel-blue focus:outline-none"
        aria-label="Toggle navigation menu"
        aria-expanded="isMenuOpen"
        aria-controls="mobile-navigation"
      >
        <div class="w-7 h-7 relative pointer-events-none">
          <!-- Hamburger Icon (3 bars) - No click handler here -->
          <svg 
            v-if="!isMenuOpen"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            class="w-full h-full transition-all duration-300 pointer-events-none"
          >
            <path fill-rule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
          </svg>
          
          <!-- Close/X Icon - No click handler here -->
          <svg 
            v-else
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            class="w-full h-full transition-all duration-300 pointer-events-none"
          >
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </div>
      </button>
    </div>

    <!-- Mobile Navigation Menu -->
    <div v-show="isMenuOpen" id="mobile-navigation" class="lg:hidden absolute top-full left-0 right-0 bg-white shadow-md border-t border-neutral/10 py-4">
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

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value;
  // Force a re-render if needed
  nextTick(() => {
    // This ensures the DOM updates properly
  });
};

// Handle scroll event to change header style
onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 50;
    if (window.scrollY > 50 && isMenuOpen.value) {
      isMenuOpen.value = false;
    }
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
<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>