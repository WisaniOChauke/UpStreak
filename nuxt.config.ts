export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  devServer: { open: '/' },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  typescript: { typeCheck: false },
  app: {
    head: {
      title: 'Dayloom',
      meta: [
        { name: 'description', content: 'Weave your day — habits, goals, and journal in one place.' },
        { name: 'theme-color', content: '#F59E0B' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
