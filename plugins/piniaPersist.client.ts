import { defineNuxtPlugin } from '#app'
import piniaPersist from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia?.use((context) => {
    return piniaPersist(context)
  })
})
