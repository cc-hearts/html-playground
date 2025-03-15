// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['assets/scss/theme.scss'],
  modules: ['@unocss/nuxt'],
  compatibilityDate: '2025-03-15',
})