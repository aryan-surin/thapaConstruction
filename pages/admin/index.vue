<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-primary">Thapa Construction Admin</h1>
            <p class="text-sm text-neutral">Welcome back, {{ userEmail }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" target="_blank" class="text-steel-blue hover:text-accent transition-colors">
              <Icon name="heroicons:arrow-top-right-on-square" class="w-5 h-5 inline mr-1" />
              View Website
            </NuxtLink>
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 inline mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Projects -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral mb-1">Total Projects</p>
              <p class="text-3xl font-bold text-primary">{{ stats.totalProjects }}</p>
            </div>
            <div class="bg-blue-100 rounded-full p-3">
              <Icon name="heroicons:building-office-2" class="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Featured Projects -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral mb-1">Featured Projects</p>
              <p class="text-3xl font-bold text-primary">{{ stats.featuredProjects }}</p>
            </div>
            <div class="bg-yellow-100 rounded-full p-3">
              <Icon name="heroicons:star" class="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral mb-1">Categories</p>
              <p class="text-3xl font-bold text-primary">{{ stats.categories }}</p>
            </div>
            <div class="bg-green-100 rounded-full p-3">
              <Icon name="heroicons:folder-open" class="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-bold text-primary mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            to="/admin/projects"
            class="flex items-center p-4 border-2 border-neutral/20 rounded-lg hover:border-accent hover:bg-accent/5 transition-all group"
          >
            <Icon name="heroicons:folder-open" class="w-8 h-8 text-steel-blue group-hover:text-accent mr-3" />
            <div>
              <p class="font-semibold text-primary">Manage Projects</p>
              <p class="text-sm text-neutral">View & edit all projects</p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/projects/create"
            class="flex items-center p-4 border-2 border-neutral/20 rounded-lg hover:border-accent hover:bg-accent/5 transition-all group"
          >
            <Icon name="heroicons:plus-circle" class="w-8 h-8 text-steel-blue group-hover:text-accent mr-3" />
            <div>
              <p class="font-semibold text-primary">Add New Project</p>
              <p class="text-sm text-neutral">Create a new project</p>
            </div>
          </NuxtLink>

          <button
            @click="refreshData"
            :disabled="loading"
            class="flex items-center p-4 border-2 border-neutral/20 rounded-lg hover:border-accent hover:bg-accent/5 transition-all group disabled:opacity-50"
          >
            <Icon name="heroicons:arrow-path" class="w-8 h-8 text-steel-blue group-hover:text-accent mr-3" :class="{ 'animate-spin': loading }" />
            <div class="text-left">
              <p class="font-semibold text-primary">Refresh Data</p>
              <p class="text-sm text-neutral">Reload from database</p>
            </div>
          </button>

          <NuxtLink
            to="/"
            target="_blank"
            class="flex items-center p-4 border-2 border-neutral/20 rounded-lg hover:border-accent hover:bg-accent/5 transition-all group"
          >
            <Icon name="heroicons:globe-alt" class="w-8 h-8 text-steel-blue group-hover:text-accent mr-3" />
            <div>
              <p class="font-semibold text-primary">View Website</p>
              <p class="text-sm text-neutral">Open public site</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Projects -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-primary">Recent Projects</h2>
          <NuxtLink to="/admin/projects" class="text-accent hover:text-accent/80 text-sm font-medium">
            View All →
          </NuxtLink>
        </div>
        
        <div v-if="loading" class="text-center py-8">
          <Icon name="svg-spinners:270-ring" class="w-8 h-8 text-accent mx-auto" />
          <p class="text-neutral mt-2">Loading projects...</p>
        </div>

        <div v-else-if="recentProjects.length === 0" class="text-center py-8">
          <Icon name="heroicons:folder-open" class="w-12 h-12 text-neutral/30 mx-auto mb-2" />
          <p class="text-neutral">No projects yet. Create your first project!</p>
          <NuxtLink to="/admin/projects/create" class="btn-primary mt-4 inline-block">
            Add Project
          </NuxtLink>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="project in recentProjects" :key="project.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img v-if="project.image" :src="project.image" :alt="project.title" class="w-10 h-10 rounded object-cover mr-3" />
                    <div class="text-sm font-medium text-gray-900">{{ project.title }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ project.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ project.location }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="project.featured" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Featured
                  </span>
                  <span v-else class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Active
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <NuxtLink :to="`/admin/projects/${project.id}/edit`" class="text-accent hover:text-accent/80 mr-3">
                    Edit
                  </NuxtLink>
                  <NuxtLink :to="`/projects/${project.id}`" target="_blank" class="text-steel-blue hover:text-primary">
                    View
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '~/stores/projects'

/**
 * Admin Dashboard
 * 
 * Main admin panel showing overview statistics and quick actions.
 * Displays recent projects and provides navigation to admin features.
 */

definePageMeta({
  middleware: 'auth'
})

// Supabase client
const { $supabase } = useNuxtApp()

// Projects store
const projectsStore = useProjectsStore()

// UI state
const loading = ref(false)
const userEmail = ref('')

// Get user email
onMounted(async () => {
  const { data: { session } } = await $supabase.auth.getSession()
  if (session?.user?.email) {
    userEmail.value = session.user.email
  }
  
  // Fetch projects
  await refreshData()
})

// Statistics
const stats = computed(() => ({
  totalProjects: projectsStore.allProjects.length,
  featuredProjects: projectsStore.allProjects.filter(p => p.featured).length,
  categories: projectsStore.categories.length
}))

// Recent projects (last 5)
const recentProjects = computed(() => projectsStore.allProjects.slice(0, 5))

/**
 * Refresh data from Supabase
 */
const refreshData = async () => {
  loading.value = true
  await projectsStore.fetchProjects()
  loading.value = false
}

/**
 * Handle logout
 */
const handleLogout = async () => {
  try {
    await $supabase.auth.signOut()
    navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// SEO
useHead({
  title: 'Admin Dashboard - Thapa Construction',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
