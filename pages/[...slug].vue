<template>
  <div>
    <section class="py-32 bg-primary/95 text-white">
      <div class="container-custom text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Page Not Found</h1>
        <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div class="flex justify-center">
          <NuxtLink to="/" class="btn-primary">
            Back to Homepage
          </NuxtLink>
        </div>
      </div>
    </section>
    
    <section class="py-20">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="section-title mx-auto after:mx-auto">You Might Be Looking For</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(item, index) in helpfulLinks" :key="index" class="bg-white p-6 rounded-lg shadow-md border border-neutral/10 hover:border-accent/20 hover:shadow-lg transition-all duration-300">
            <h3 class="text-xl font-semibold text-primary mb-3">{{ item.title }}</h3>
            <p class="text-neutral mb-4">{{ item.description }}</p>
            <NuxtLink :to="item.link" class="flex items-center text-steel-blue hover:text-accent transition-colors duration-300">
              {{ item.linkText }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-secondary">
      <div class="container-custom text-center">
        <h2 class="text-3xl font-bold text-primary mb-6">Need Help Finding Something?</h2>
        <p class="text-neutral max-w-3xl mx-auto mb-8">
          If you're having trouble finding what you're looking for, our team is here to help.
          Feel free to contact us and we'll point you in the right direction.
        </p>
        <NuxtLink to="/contact" class="btn-primary">
          Contact Us
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: 'Page Not Found - Thapa Construction',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
});

/**
 * Helpful navigation links for users who encountered 404 error
 */
const helpfulLinks = [
  {
    title: 'Our Services',
    description: 'Explore our comprehensive range of construction and design services.',
    link: '/services',
    linkText: 'View Services'
  },
  {
    title: 'Project Portfolio',
    description: 'Browse through our completed construction projects in Darjeeling and beyond.',
    link: '/projects',
    linkText: 'See Projects'
  },
  {
    title: 'Contact Information',
    description: 'Get in touch with our team to discuss your construction needs.',
    link: '/contact',
    linkText: 'Contact Us'
  }
];
</script>
