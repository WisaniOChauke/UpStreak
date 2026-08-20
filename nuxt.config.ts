export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
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
  typescript: { typeCheck: false }
})
