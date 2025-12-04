// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-icon',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Thapa Construction - Premier Construction Services in Darjeeling',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Thapa Construction offers professional construction services in Darjeeling, West Bengal including general construction, renovation, remodeling, architectural design and more.'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'construction, Darjeeling, West Bengal, renovation, remodeling, architectural design, interior design, roofing, flooring, tiling, painting'
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#1F2A44' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://thapaconstruction.com',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY || '',
    }
  },
  sitemap: {
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://thapaconstruction.com',
  },
  robots: {
    rules: {
      UserAgent: '*',
      Allow: '/',
      Sitemap: 'https://thapaconstruction.com/sitemap.xml'
    }
  }
})
