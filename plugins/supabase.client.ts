/**
 * Supabase Client Plugin
 * 
 * Initializes Supabase client for use throughout the Nuxt application.
 * Provides authentication and database access to all components.
 * 
 * This plugin runs on both client and server sides.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // Get environment variables with fallback
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  // Validate environment variables
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables')
    console.error('SUPABASE_URL:', supabaseUrl || 'Missing')
    console.error('SUPABASE_KEY:', supabaseKey ? 'Present' : 'Missing')
    console.error('Please check your .env file and restart the server')
  }

  // Initialize Supabase client with environment variables
  const supabase: SupabaseClient = createClient(
    supabaseUrl || '',
    supabaseKey || '',
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  )

  // Log successful initialization (only once)
  if (process.client) {
    console.log('✅ Supabase client initialized')
  }

  // Make Supabase client available throughout the app
  return {
    provide: {
      supabase
    }
  }
})
