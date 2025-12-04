/**
 * Admin Authentication Middleware
 * 
 * Protects admin routes by checking if user is authenticated.
 * Redirects to login page if not authenticated.
 * 
 * Note: This middleware runs on client-side only to ensure Supabase plugin is available.
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side where plugins are available
  if (process.server) return

  const nuxtApp = useNuxtApp()
  
  // Check if $supabase is available
  if (!nuxtApp.$supabase) {
    console.error('Supabase client not available')
    return
  }

  try {
    // Check if user is authenticated
    const { data: { session } } = await nuxtApp.$supabase.auth.getSession()

    // If not authenticated and trying to access admin pages, redirect to login
    if (!session && to.path.startsWith('/admin') && to.path !== '/admin/login') {
      return navigateTo('/admin/login')
    }

    // If authenticated and trying to access login page, redirect to dashboard
    if (session && to.path === '/admin/login') {
      return navigateTo('/admin')
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    // On error, allow navigation to login page
    if (to.path !== '/admin/login') {
      return navigateTo('/admin/login')
    }
  }
})
