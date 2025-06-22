<template>
  <div 
    class="group bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-neutral/10 hover:border-accent/30"
    :class="{'h-full': fullHeight}"
  >
    <div class="relative h-56 overflow-hidden">
      <img 
        :src="image" 
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-primary/30 group-hover:bg-primary/20 transition-all duration-300"></div>
      <div class="absolute top-4 left-4">
        <Icon :name="icon" class="w-12 h-12 text-accent bg-primary/80 p-2 rounded-lg" />
      </div>
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold mb-3 text-primary group-hover:text-steel-blue transition-colors duration-300">{{ title }}</h3>
      <p class="text-neutral mb-4">{{ description }}</p>
      <NuxtLink 
        :to="linkUrl" 
        class="flex items-center text-steel-blue font-medium group-hover:text-accent transition-colors duration-300"
      >
        Learn More
        <Icon name="heroicons:arrow-long-right" class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ServiceCard Component
 * 
 * Displays a card for a construction service with image, icon, title, and description
 */

interface ServiceCardProps {
  /**
   * Service title
   */
  title: string;
  
  /**
   * Brief description of the service
   */
  description: string;
  
  /**
   * Path to the service image
   */
  image: string;
  
  /**
   * Icon name (from icon library)
   */
  icon: string;
  
  /**
   * Link target - can be a path or anchor ID
   */
  link: string;
  
  /**
   * Whether the card should expand to fill container height
   */
  fullHeight?: boolean;
}

// Props definition with defaults
const props = withDefaults(defineProps<ServiceCardProps>(), {
  fullHeight: true
});

/**
 * Computed property to handle both regular routes and anchor links
 */
const linkUrl = computed(() => {
  // If link starts with #, it's an anchor on the services page
  if (props.link.startsWith('#')) {
    return `/services${props.link}`;
  }
  
  // If link already contains '/', return as is
  if (props.link.includes('/')) {
    return props.link;
  }
  
  // Otherwise, it's a service ID - convert to an anchor on the services page
  return `/services#${props.link}`;
});
</script>
