<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div>
            <NuxtLink to="/admin" class="text-steel-blue hover:text-accent text-sm mb-1 inline-block">
              ← Back to Dashboard
            </NuxtLink>
            <h1 class="text-2xl font-bold text-primary">Manage Projects</h1>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/admin/projects/create" class="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
              Add New Project
            </NuxtLink>
            <button @click="handleLogout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 inline mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-neutral mb-1">Total Projects</p>
          <p class="text-3xl font-bold text-primary">{{ projects.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-neutral mb-1">Featured</p>
          <p class="text-3xl font-bold text-yellow-600">{{ featuredCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-neutral mb-1">Categories</p>
          <p class="text-3xl font-bold text-green-600">{{ categoriesCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-neutral mb-1">Active</p>
          <p class="text-3xl font-bold text-blue-600">{{ projects.length }}</p>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>

      <!-- Projects Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-primary">All Projects</h2>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <Icon name="svg-spinners:270-ring" class="w-12 h-12 text-accent mx-auto mb-4" />
          <p class="text-neutral">Loading projects...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="projects.length === 0" class="text-center py-12">
          <Icon name="heroicons:folder-open" class="w-16 h-16 text-neutral/30 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-primary mb-2">No Projects Yet</h3>
          <p class="text-neutral mb-6">Get started by creating your first project</p>
          <NuxtLink to="/admin/projects/create" class="btn-primary inline-flex items-center">
            <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
            Create Project
          </NuxtLink>
        </div>

        <!-- Projects Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="project in projects" :key="project.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <img 
                    v-if="project.image" 
                    :src="project.image" 
                    :alt="project.title" 
                    class="w-16 h-16 rounded object-cover"
                  />
                  <div v-else class="w-16 h-16 rounded bg-gray-200 flex items-center justify-center">
                    <Icon name="heroicons:photo" class="w-8 h-8 text-gray-400" />
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 max-w-xs truncate">{{ project.title }}</div>
                  <div class="text-sm text-gray-500 max-w-xs truncate">{{ project.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ project.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ project.location }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="project.featured" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    <Icon name="heroicons:star-solid" class="w-3 h-3 mr-1" />
                    Featured
                  </span>
                  <span v-else class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Active
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <NuxtLink 
                    :to="`/projects/${project.id}`" 
                    target="_blank"
                    class="text-steel-blue hover:text-primary transition-colors"
                    title="View on website"
                  >
                    <Icon name="heroicons:eye" class="w-5 h-5 inline" />
                  </NuxtLink>
                  <NuxtLink 
                    :to="`/admin/projects/${project.id}/edit`" 
                    class="text-accent hover:text-accent/80 transition-colors"
                    title="Edit project"
                  >
                    <Icon name="heroicons:pencil-square" class="w-5 h-5 inline" />
                  </NuxtLink>
                  <button
                    @click="confirmDelete(project)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete project"
                  >
                    <Icon name="heroicons:trash" class="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-red-600" />
        </div>
        <h3 class="text-xl font-bold text-center text-primary mb-2">Delete Project?</h3>
        <p class="text-center text-neutral mb-6">
          Are you sure you want to delete <strong>"{{ projectToDelete?.title }}"</strong>? This action cannot be undone.
        </p>
        <div class="flex space-x-4">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <span v-if="!deleting">Delete</span>
            <span v-else class="flex items-center justify-center">
              <Icon name="svg-spinners:270-ring" class="w-5 h-5 mr-2" />
              Deleting...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '~/stores/projects'

/**
 * Admin Projects List Page
 * 
 * Displays all projects in a table with options to view, edit, or delete.
 */

definePageMeta({
  middleware: 'auth'
})

const { $supabase } = useNuxtApp()
const projectsStore = useProjectsStore()

// State
const loading = ref(false)
const deleting = ref(false)
const showDeleteModal = ref(false)
const projectToDelete = ref<any>(null)
const successMessage = ref('')
const errorMessage = ref('')

// Computed
const projects = computed(() => projectsStore.allProjects)
const featuredCount = computed(() => projects.value.filter((p: any) => p.featured).length)
const categoriesCount = computed(() => projectsStore.categories.length)

// Load projects on mount
onMounted(async () => {
  loading.value = true
  await projectsStore.fetchProjects()
  loading.value = false
})

/**
 * Show delete confirmation modal
 */
const confirmDelete = (project: any) => {
  projectToDelete.value = project
  showDeleteModal.value = true
}

/**
 * Handle project deletion
 */
const handleDelete = async () => {
  if (!projectToDelete.value) return

  deleting.value = true
  errorMessage.value = ''

  try {
    const result = await projectsStore.deleteProject(projectToDelete.value.id)

    if (result.success) {
      successMessage.value = `Project "${projectToDelete.value.title}" deleted successfully!`
      showDeleteModal.value = false
      projectToDelete.value = null

      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = result.error || 'Failed to delete project'
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred while deleting the project'
  } finally {
    deleting.value = false
  }
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
  title: 'Manage Projects - Admin - Thapa Construction',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
