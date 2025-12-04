<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-steel-blue to-primary/90 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-10">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-primary">
          Admin Login
        </h2>
        <p class="mt-2 text-sm text-neutral">
          Sign in to manage Thapa Construction website
        </p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ errorMessage }}</span>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ successMessage }}</span>
        </div>

        <div class="space-y-4">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-primary mb-1">
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="appearance-none relative block w-full px-3 py-3 border border-neutral/30 placeholder-neutral/50 text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              placeholder="admin@thapaconstruction.com"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-primary mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="appearance-none relative block w-full px-3 py-3 border border-neutral/30 placeholder-neutral/50 text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <!-- Remember Me (optional) -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-accent focus:ring-accent border-neutral/30 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-neutral">
              Remember me
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else class="flex items-center">
              <Icon name="svg-spinners:270-ring" class="w-5 h-5 mr-2" />
              Signing in...
            </span>
          </button>
        </div>
      </form>

      <!-- Back to Home -->
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-steel-blue hover:text-accent transition-colors">
          ← Back to Website
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * Admin Login Page
 * 
 * Handles authentication for admin users using Supabase Auth.
 * Redirects to admin dashboard upon successful login.
 */

definePageMeta({
  layout: false,
  middleware: 'auth'
})

// Supabase client
const { $supabase } = useNuxtApp()

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

// UI state
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

/**
 * Handle login form submission
 */
const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { data, error } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) throw error

    if (data.session) {
      successMessage.value = 'Login successful! Redirecting...'
      
      // Redirect to admin dashboard after short delay
      setTimeout(() => {
        navigateTo('/admin')
      }, 1000)
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Invalid email or password. Please try again.'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: 'Admin Login - Thapa Construction',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
/* Optional custom styles */
</style>
