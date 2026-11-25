import { isSupabaseConfigured, useSupabaseClient } from '~/composables/useSupabaseClient'

const publicRoutes = new Set(['/login', '/register', '/forgot-password', '/reset-password'])

export default defineNuxtRouteMiddleware(async (to) => {
  if (!isSupabaseConfigured()) return

  const { data, error } = await useSupabaseClient().auth.getSession()
  if (error) {
    throw createError({ statusCode: 503, statusMessage: 'Unable to check your sign-in session.' })
  }

  if (!data.session && !publicRoutes.has(to.path)) {
    return navigateTo('/login')
  }

  if (data.session && publicRoutes.has(to.path)) {
    return navigateTo('/')
  }
})
