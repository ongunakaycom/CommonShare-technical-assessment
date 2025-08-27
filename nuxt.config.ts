// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@nuxt/test-utils'
  ],

  // Add this section for global CSS
  css: [
    'bootstrap/dist/css/bootstrap.min.css'
  ]
})
