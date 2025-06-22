<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Default SEO
useHead({
  titleTemplate: '%s - Thapa Construction',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'theme-color', content: '#1F2A44' },
    { name: 'og:site_name', content: 'Thapa Construction' },
    { 
      name: 'og:locale', 
      content: 'en_US' 
    },
    { 
      name: 'og:type', 
      content: 'website' 
    }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
});
</script>
