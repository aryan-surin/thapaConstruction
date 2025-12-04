<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <NuxtLink to="/admin/projects" class="text-steel-blue hover:text-accent text-sm mb-1 inline-block">
          ← Back to Projects
        </NuxtLink>
        <h1 class="text-2xl font-bold text-primary">Edit Project</h1>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <Icon name="svg-spinners:270-ring" class="w-12 h-12 text-accent mx-auto mb-4" />
        <p class="text-neutral">Loading project...</p>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!project" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <Icon name="heroicons:exclamation-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-primary mb-2">Project Not Found</h2>
        <p class="text-neutral mb-6">The project you're looking for doesn't exist.</p>
        <NuxtLink to="/admin/projects" class="btn-primary inline-block">
          Back to Projects
        </NuxtLink>
      </div>
    </div>

    <!-- Edit Form -->
    <main v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-lg p-8">
        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {{ successMessage }}
        </div>

        <!-- Basic Information -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-primary mb-4 flex items-center">
            <Icon name="heroicons:information-circle" class="w-5 h-5 mr-2" />
            Basic Information
          </h2>

          <!-- Title -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Project Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              id="title"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., Premium Modular Kitchen Installation"
            />
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              id="description"
              required
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Brief description of the project..."
            ></textarea>
          </div>

          <!-- Category & Location -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                Category <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.category"
                id="category"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="Interior Design">Interior Design</option>
                <option value="Renovation">Renovation</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Construction">Construction</option>
                <option value="Painting">Painting</option>
                <option value="Flooring">Flooring</option>
              </select>
            </div>

            <div>
              <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
                Location <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.location"
                type="text"
                id="location"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="e.g., Siliguri, West Bengal"
              />
            </div>
          </div>

          <!-- Featured Checkbox -->
          <div class="flex items-center mb-4">
            <input
              v-model="form.featured"
              type="checkbox"
              id="featured"
              class="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"
            />
            <label for="featured" class="ml-2 block text-sm text-gray-700">
              Mark as Featured Project
            </label>
          </div>
        </div>

        <!-- Images Upload -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-primary mb-4 flex items-center">
            <Icon name="heroicons:photo" class="w-5 h-5 mr-2" />
            Project Images
          </h2>

          <!-- Main Image -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Main Image <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center space-x-4">
              <div v-if="mainImagePreview" class="relative">
                <img :src="mainImagePreview" alt="Preview" class="w-32 h-32 object-cover rounded-lg" />
                <button
                  type="button"
                  @click="clearMainImage"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <Icon name="heroicons:x-mark" class="w-4 h-4" />
                </button>
              </div>
              <label class="cursor-pointer">
                <div class="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent transition-colors">
                  <div class="text-center">
                    <Icon name="heroicons:arrow-up-tray" class="w-8 h-8 text-gray-400 mx-auto" />
                    <p class="text-xs text-gray-500 mt-1">{{ mainImageFile ? 'Change' : 'Upload' }}</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleMainImageUpload"
                  class="hidden"
                />
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-2">Recommended: 800x600px, Max 2MB</p>
          </div>

          <!-- Full/Hero Image (Optional) -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hero Image (Optional)
            </label>
            <div class="flex items-center space-x-4">
              <div v-if="fullImagePreview" class="relative">
                <img :src="fullImagePreview" alt="Preview" class="w-32 h-32 object-cover rounded-lg" />
                <button
                  type="button"
                  @click="clearFullImage"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <Icon name="heroicons:x-mark" class="w-4 h-4" />
                </button>
              </div>
              <label class="cursor-pointer">
                <div class="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent transition-colors">
                  <div class="text-center">
                    <Icon name="heroicons:arrow-up-tray" class="w-8 h-8 text-gray-400 mx-auto" />
                    <p class="text-xs text-gray-500 mt-1">{{ fullImageFile ? 'Change' : 'Upload' }}</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFullImageUpload"
                  class="hidden"
                />
              </label>
            </div>
          </div>

          <!-- Gallery Images (Multiple) -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Project Gallery (Max 5 images)
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <!-- Existing Gallery Images -->
              <div v-for="(preview, idx) in galleryPreviews" :key="idx" class="relative">
                <img :src="preview" alt="Gallery" class="w-full h-32 object-cover rounded-lg" />
                <button
                  type="button"
                  @click="removeGalleryImage(idx)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <Icon name="heroicons:x-mark" class="w-4 h-4" />
                </button>
              </div>

              <!-- Upload Button (Show only if less than 5 images) -->
              <label v-if="galleryPreviews.length < 5" class="cursor-pointer">
                <div class="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent transition-colors">
                  <Icon name="heroicons:arrow-up-tray" class="w-8 h-8 text-gray-400" />
                  <p class="text-xs text-gray-500 mt-1">Add Image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleGalleryUpload"
                  class="hidden"
                />
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-2">{{ galleryPreviews.length }}/5 images</p>
          </div>
        </div>

        <!-- Project Details (JSON) -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-primary mb-4 flex items-center">
            <Icon name="heroicons:list-bullet" class="w-5 h-5 mr-2" />
            Project Details
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="completion" class="block text-sm font-medium text-gray-700 mb-2">
                Completion Date
              </label>
              <input
                v-model="form.details.Completion"
                type="text"
                id="completion"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="e.g., March 2024"
              />
            </div>

            <div>
              <label for="area" class="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <input
                v-model="form.details.Area"
                type="text"
                id="area"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="e.g., 120 sq ft"
              />
            </div>

            <div>
              <label for="services" class="block text-sm font-medium text-gray-700 mb-2">
                Services
              </label>
              <input
                v-model="form.details.Services"
                type="text"
                id="services"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="e.g., Kitchen design & installation"
              />
            </div>

            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                v-model="form.details.Duration"
                type="text"
                id="duration"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="e.g., 3 weeks"
              />
            </div>
          </div>

          <div class="mt-4">
            <label for="features" class="block text-sm font-medium text-gray-700 mb-2">
              Special Features
            </label>
            <textarea
              v-model="form.details['Special Features']"
              id="features"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., Soft-close hinges, granite countertop, chimney installation"
            ></textarea>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex space-x-4">
          <button
            type="button"
            @click="navigateTo('/admin/projects')"
            class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!submitting">Update Project</span>
            <span v-else class="flex items-center justify-center">
              <Icon name="svg-spinners:270-ring" class="w-5 h-5 mr-2" />
              Updating...
            </span>
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '~/stores/projects'

/**
 * Edit Project Page
 * 
 * Form to edit an existing project with image upload functionality.
 */

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const projectsStore = useProjectsStore()

// Get project ID from route
const projectId = route.params.id as string

// State
const loading = ref(true)
const project = ref<any>(null)

// Form state
const form = ref({
  title: '',
  description: '',
  category: '',
  location: '',
  featured: false,
  details: {
    'Completion': '',
    'Area': '',
    'Services': '',
    'Duration': '',
    'Special Features': ''
  }
})

// Image files
const mainImageFile = ref<File | null>(null)
const fullImageFile = ref<File | null>(null)
const mainImagePreview = ref('')
const fullImagePreview = ref('')

// Gallery images
const galleryFiles = ref<File[]>([])
const galleryPreviews = ref<string[]>([])
const existingGalleryUrls = ref<string[]>([])

// UI state
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

/**
 * Load project data on mount
 */
onMounted(async () => {
  try {
    project.value = await projectsStore.fetchProjectById(projectId)
    
    if (project.value) {
      // Populate form with existing data
      form.value = {
        title: project.value.title || '',
        description: project.value.description || '',
        category: project.value.category || '',
        location: project.value.location || '',
        featured: project.value.featured || false,
        details: project.value.details || {
          'Completion': '',
          'Area': '',
          'Services': '',
          'Duration': '',
          'Special Features': ''
        }
      }
      
      // Set image previews
      mainImagePreview.value = project.value.image || ''
      fullImagePreview.value = project.value.full_image || project.value.image || ''
      
      // Set gallery previews
      if (project.value.gallery && Array.isArray(project.value.gallery)) {
        existingGalleryUrls.value = [...project.value.gallery]
        galleryPreviews.value = [...project.value.gallery]
      }
    }
  } catch (error) {
    console.error('Error loading project:', error)
  } finally {
    loading.value = false
  }
})

/**
 * Handle main image upload
 */
const handleMainImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    mainImageFile.value = file
    mainImagePreview.value = URL.createObjectURL(file)
  }
}

/**
 * Handle full/hero image upload
 */
const handleFullImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    fullImageFile.value = file
    fullImagePreview.value = URL.createObjectURL(file)
  }
}

/**
 * Clear main image
 */
const clearMainImage = () => {
  if (mainImageFile.value) {
    mainImageFile.value = null
    mainImagePreview.value = project.value?.image || ''
  }
}

/**
 * Clear full image
 */
const clearFullImage = () => {
  if (fullImageFile.value) {
    fullImageFile.value = null
    fullImagePreview.value = project.value?.full_image || project.value?.image || ''
  }
}

/**
 * Handle gallery images upload
 */
const handleGalleryUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files) {
    const remainingSlots = 5 - galleryPreviews.value.length
    const filesToAdd = Array.from(files).slice(0, remainingSlots)
    
    filesToAdd.forEach(file => {
      galleryFiles.value.push(file)
      galleryPreviews.value.push(URL.createObjectURL(file))
    })
  }
  
  // Reset input
  target.value = ''
}

/**
 * Remove gallery image by index
 */
const removeGalleryImage = (index: number) => {
  const removedUrl = galleryPreviews.value[index]
  
  // Check if it's an existing URL or a new file
  const existingIndex = existingGalleryUrls.value.indexOf(removedUrl)
  if (existingIndex !== -1) {
    // Remove from existing URLs
    existingGalleryUrls.value.splice(existingIndex, 1)
  } else {
    // Remove from new files
    const fileIndex = galleryPreviews.value.slice(existingGalleryUrls.value.length).indexOf(removedUrl)
    if (fileIndex !== -1) {
      galleryFiles.value.splice(fileIndex, 1)
    }
  }
  
  galleryPreviews.value.splice(index, 1)
}

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    let mainImageUrl = project.value.image
    let fullImageUrl = project.value.full_image

    // Upload new main image if changed
    if (mainImageFile.value) {
      const mainImageResult = await projectsStore.uploadImage(mainImageFile.value, 'projects')
      if (!mainImageResult.success) {
        throw new Error(mainImageResult.error || 'Failed to upload main image')
      }
      mainImageUrl = mainImageResult.url
    }

    // Upload new full image if changed
    if (fullImageFile.value) {
      const fullImageResult = await projectsStore.uploadImage(fullImageFile.value, 'projects')
      if (fullImageResult.success) {
        fullImageUrl = fullImageResult.url
      }
    }

    // Upload new gallery images and combine with existing
    const newGalleryUrls: string[] = []
    for (const file of galleryFiles.value) {
      const galleryResult = await projectsStore.uploadImage(file, 'projects/gallery')
      if (galleryResult.success) {
        newGalleryUrls.push(galleryResult.url)
      }
    }
    
    // Combine existing and new gallery URLs
    const finalGalleryUrls = [...existingGalleryUrls.value, ...newGalleryUrls]

    // Prepare project data
    const projectData = {
      title: form.value.title,
      description: form.value.description,
      category: form.value.category,
      location: form.value.location,
      image: mainImageUrl,
      full_image: fullImageUrl || mainImageUrl,
      featured: form.value.featured,
      details: form.value.details,
      gallery: finalGalleryUrls
    }

    // Update project
    const result = await projectsStore.updateProject(projectId, projectData)

    if (result.success) {
      successMessage.value = 'Project updated successfully!'
      
      // Redirect to projects list after 1 second
      setTimeout(() => {
        navigateTo('/admin/projects')
      }, 1000)
    } else {
      throw new Error(result.error || 'Failed to update project')
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred while updating the project'
    console.error('Update project error:', error)
  } finally {
    submitting.value = false
  }
}

// SEO
useHead({
  title: 'Edit Project - Admin - Thapa Construction',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
