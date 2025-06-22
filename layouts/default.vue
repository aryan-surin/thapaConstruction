<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
    
    <!-- Back to top button -->
    <button 
      @click="scrollToTop" 
      v-show="showBackToTop"
      class="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-accent hover:text-primary transition-all duration-300 z-30"
      aria-label="Back to top"
    >
      <Icon name="heroicons:arrow-up" class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
const showBackToTop = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  const handleScroll = () => {
    showBackToTop.value = window.scrollY > 500;
  };
  
  window.addEventListener('scroll', handleScroll);
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>
