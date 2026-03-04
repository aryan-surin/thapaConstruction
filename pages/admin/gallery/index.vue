<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <NuxtLink to="/admin" class="text-steel-blue hover:text-accent text-sm mb-1 inline-block">
            ← Back to Dashboard
          </NuxtLink>
          <h1 class="text-2xl font-bold text-primary">Manage Gallery</h1>
          <p class="text-neutral text-sm">Curate project references and limited standalone uploads.</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="refreshData"
            :disabled="galleryStore.loading"
            class="px-4 py-2 border border-neutral/30 rounded-lg hover:border-accent hover:bg-accent/5 transition disabled:opacity-60"
          >
            <span class="flex items-center">
              <Icon
                name="heroicons:arrow-path"
                class="w-5 h-5 mr-2"
                :class="{ 'animate-spin': galleryStore.loading }"
              />
              Refresh
            </span>
          </button>
          <button
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 inline mr-1" />
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Status Messages -->
      <div v-if="successMessage" class="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ errorMessage }}
      </div>

      <!-- Caps Alert -->
      <div v-if="totalCapReached" class="bg-amber-50 border border-amber-400 text-amber-800 px-4 py-3 rounded">
        Gallery cap reached (30 items max). Remove an item to add more.
      </div>
      <div v-else-if="standaloneCapReached" class="bg-amber-50 border border-amber-400 text-amber-800 px-4 py-3 rounded">
        Standalone cap reached (5 items max). Remove a standalone image to upload another.
      </div>

      <!-- Stats -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-neutral">Total Gallery Items</p>
            <p class="text-3xl font-bold text-primary">{{ galleryStore.totalCount }}/30</p>
          </div>
          <Icon name="heroicons:photo" class="w-10 h-10 text-steel-blue" />
        </div>
        <div class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-neutral">Project References</p>
            <p class="text-3xl font-bold text-primary">{{ galleryStore.projectCount }}</p>
          </div>
          <Icon name="heroicons:briefcase" class="w-10 h-10 text-accent" />
        </div>
        <div class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-neutral">Standalone Uploads</p>
            <p class="text-3xl font-bold text-primary">{{ galleryStore.standaloneCount }}/5</p>
          </div>
          <Icon name="heroicons:cloud-arrow-up" class="w-10 h-10 text-green-600" />
        </div>
      </section>

      <!-- Project Images Selector -->
      <section class="bg-white rounded-lg shadow p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-primary">Add Project Images</h2>
            <p class="text-neutral text-sm">Select from existing project assets (no re-upload).</p>
          </div>
          <div class="flex items-center space-x-3">
            <label class="text-sm text-neutral">Filter by project:</label>
            <select
              v-model="selectedProjectId"
              class="border border-neutral/30 rounded px-3 py-2 text-sm focus:ring-accent focus:border-accent"
            >
              <option value="all">All projects</option>
              <option v-for="project in projectsStore.allProjects" :key="project.id" :value="project.id">
                {{ project.title }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="projectCandidates.length === 0" class="text-neutral text-sm">
          No project images found. Add projects or refresh.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="candidate in filteredCandidates"
            :key="candidate.url"
            class="border rounded-lg p-3 flex space-x-3 hover:border-accent transition"
          >
            <img :src="getImageUrl(candidate.url)" :alt="candidate.label" class="w-20 h-20 object-cover rounded" />
            <div class="flex-1 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-primary">{{ candidate.projectTitle }}</p>
                  <p class="text-xs text-neutral">{{ candidate.label }}</p>
                </div>
                <span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">Project</span>
              </div>
              <div class="space-y-2">
                <input
                  v-model="projectImageForms[candidate.url].altText"
                  type="text"
                  class="w-full border border-neutral/30 rounded px-3 py-2 text-sm focus:ring-accent focus:border-accent"
                  placeholder="Alt text (required)"
                />
                <input
                  v-model="projectImageForms[candidate.url].caption"
                  type="text"
                  class="w-full border border-neutral/30 rounded px-3 py-2 text-sm focus:ring-accent focus:border-accent"
                  placeholder="Caption (optional)"
                />
                <input
                  v-model.number="projectImageForms[candidate.url].sortOrder"
                  type="number"
                  class="w-full border border-neutral/30 rounded px-3 py-2 text-sm focus:ring-accent focus:border-accent"
                  placeholder="Sort order (default 0)"
                />
                <button
                  @click="handleAddProjectImage(candidate)"
                  :disabled="disableProjectAdd(candidate.url)"
                  class="w-full px-3 py-2 bg-accent text-white rounded hover:bg-accent/90 transition disabled:opacity-50"
                >
                  <span v-if="!totalCapReached">Add to Gallery</span>
                  <span v-else>Cap reached</span>
                </button>
              </div>
              <p v-if="isInGallery(candidate.url)" class="text-xs text-green-700">Already in gallery</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Standalone Uploads -->
      <section class="bg-white rounded-lg shadow p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-primary">Upload Standalone Images</h2>
            <p class="text-neutral text-sm">Up to 5 total. Stored under gallery/standalone/.</p>
          </div>
          <span class="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">Standalone</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <label class="block text-sm font-medium text-primary">Select image file</label>
            <input
              type="file"
              accept="image/*"
              @change="handleStandaloneFile"
              :disabled="standaloneCapReached || totalCapReached"
              class="w-full border border-neutral/30 rounded px-3 py-2 text-sm"
            />
            <p class="text-xs text-neutral">Limit: {{ galleryStore.standaloneCount }}/5. Total cap: {{ galleryStore.totalCount }}/30.</p>
            <p v-if="standalonePreview" class="text-sm text-neutral">Selected: {{ standaloneFileName }}</p>
            <img v-if="standalonePreview" :src="standalonePreview" alt="Standalone preview" class="w-32 h-32 object-cover rounded" />
          </div>
          <div class="space-y-3">
            <input
              v-model="standaloneAltText"
              type="text"
              class="w-full border border-neutral/30 rounded px-3 py-2 text-sm focus:ring-accent focus:border-accent"
              placeholder="Alt text (required)"
            />
            <input
              v-model="standaloneCaption"
              type="text"
              class="w-full border border-neutral/30 rounded px-3 py-2 text-sm focus:ring-accent focus:border-accent"
              placeholder="Caption (optional)"
            />
            <input
              v-model.number="standaloneSortOrder"
              type="number"
              class="w-full border border-neutral/30 rounded px-3 py-2 text-sm focus:ring-accent focus:border-accent"
              placeholder="Sort order (default 0)"
            />
            <button
              @click="handleStandaloneUpload"
              :disabled="!standaloneFile || !standaloneAltText || standaloneCapReached || totalCapReached"
              class="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              Upload Standalone
            </button>
            <p v-if="standaloneCapReached" class="text-xs text-amber-700">Standalone limit reached.</p>
          </div>
        </div>
      </section>

      <!-- Existing Gallery -->
      <section class="bg-white rounded-lg shadow p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-primary">Current Gallery</h2>
          <p class="text-sm text-neutral">Ordered by sort_order then created_at.</p>
        </div>

        <div v-if="galleryStore.loading" class="text-center py-8">
          <Icon name="svg-spinners:270-ring" class="w-8 h-8 text-accent mx-auto" />
          <p class="text-neutral mt-2">Loading gallery...</p>
        </div>

        <div v-else-if="galleryStore.totalCount === 0" class="text-neutral text-sm">No gallery items yet.</div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="item in galleryStore.allItems"
            :key="item.id"
            class="border rounded-lg p-3 space-y-3"
          >
            <div class="relative">
              <img :src="getImageUrl(item.image_url)" :alt="item.alt_text" class="w-full h-40 object-cover rounded" />
              <span
                class="absolute top-2 left-2 text-xs px-2 py-1 rounded"
                :class="item.source_type === 'project' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
              >
                {{ item.source_type === 'project' ? 'Project' : 'Standalone' }}
              </span>
            </div>
            <div class="space-y-1 text-sm text-neutral">
              <p class="font-semibold text-primary">Alt: {{ item.alt_text }}</p>
              <p v-if="item.caption">Caption: {{ item.caption }}</p>
              <p v-if="item.project_id">Project ID: {{ item.project_id }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <input
                v-model.number="sortOrderDraft[item.id]"
                type="number"
                class="flex-1 border border-neutral/30 rounded px-3 py-2 text-sm focus:ring-accent focus:border-accent"
                :placeholder="`Current: ${item.sort_order}`"
              />
              <button
                @click="saveSortOrder(item)"
                class="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
              >
                Save
              </button>
            </div>
            <button
              @click="handleDelete(item)"
              class="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useProjectsStore } from '~/stores/projects'
import { useGalleryStore, type GalleryItem } from '~/stores/gallery'

interface ProjectImageCandidate {
  url: string
  projectId: string
  projectTitle: string
  label: string
}

definePageMeta({
  middleware: 'auth'
})

const nuxtApp = useNuxtApp()
const supabaseClient = nuxtApp.$supabase as any
const projectsStore = useProjectsStore()
const galleryStore = useGalleryStore()

const selectedProjectId = ref<string>('all')

// Per-image form state (keyed by image URL)
const projectImageForms = reactive<Record<string, {
  altText: string
  caption: string
  sortOrder: number
}>>({})

const standaloneFile = ref<File | null>(null)
const standalonePreview = ref<string>('')
const standaloneAltText = ref<string>('')
const standaloneCaption = ref<string>('')
const standaloneSortOrder = ref<number>(0)

const successMessage = ref<string>('')
const errorMessage = ref<string>('')
const sortOrderDraft = reactive<Record<string, number | undefined>>({})

const projectCandidates = computed<ProjectImageCandidate[]>(() => {
  const seen = new Set<string>()
  const candidates: ProjectImageCandidate[] = []

  projectsStore.allProjects.forEach((project: any) => {
    const images: Array<{ url?: string; label: string }> = [
      { url: project.image, label: 'Cover image' },
      { url: project.fullImage || project.full_image, label: 'Hero image' }
    ]

    if (Array.isArray(project.gallery)) {
      project.gallery.forEach((img: string, idx: number) => {
        images.push({ url: img, label: `Gallery ${idx + 1}` })
      })
    }

    images.forEach((img) => {
      if (img.url && !seen.has(img.url)) {
        seen.add(img.url)
        candidates.push({
          url: img.url,
          projectId: project.id,
          projectTitle: project.title,
          label: img.label
        })
      }
    })
  })

  return candidates
})

const filteredCandidates = computed<ProjectImageCandidate[]>(() => {
  const candidates = selectedProjectId.value === 'all' 
    ? projectCandidates.value 
    : projectCandidates.value.filter((c: ProjectImageCandidate) => c.projectId === selectedProjectId.value)
  
  // Initialize form state for all visible candidates
  candidates.forEach(candidate => {
    if (!projectImageForms[candidate.url]) {
      projectImageForms[candidate.url] = {
        altText: '',
        caption: '',
        sortOrder: 0
      }
    }
  })
  
  return candidates
})

const totalCapReached = computed<boolean>(() => galleryStore.totalLimitReached)
const standaloneCapReached = computed<boolean>(() => galleryStore.standaloneLimitReached)

const standaloneFileName = computed<string>(() => standaloneFile.value?.name || '')

// Normalize image URLs (handles relative paths and absolute Supabase URLs)
const getImageUrl = (url: string): string => {
  if (!url) return ''
  // If already absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // If relative path, ensure it's properly formatted
  return url.startsWith('/') ? url : `/${url}`
}

const handleStandaloneFile = (event: Event): void => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) {
    standaloneFile.value = null
    standalonePreview.value = ''
    return
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Please select a valid image file.'
    standaloneFile.value = null
    standalonePreview.value = ''
    return
  }
  
  standaloneFile.value = file
  standalonePreview.value = URL.createObjectURL(file)
  errorMessage.value = ''
}

const refreshData = async (): Promise<void> => {
  successMessage.value = ''
  errorMessage.value = ''
  await Promise.all([projectsStore.fetchProjects(), galleryStore.fetchGalleryItems()])
}

const isInGallery = (url: string): boolean => {
  return galleryStore.allItems.some((item: GalleryItem) => item.image_url === url)
}

const disableProjectAdd = (url: string): boolean => {
  return totalCapReached.value || isInGallery(url) || !projectImageForms[url]?.altText
}

const handleAddProjectImage = async (candidate: ProjectImageCandidate): Promise<void> => {
  errorMessage.value = ''
  successMessage.value = ''

  const form = projectImageForms[candidate.url]
  if (!form || !form.altText) {
    errorMessage.value = 'Alt text is required for accessibility.'
    return
  }

  const result = await galleryStore.addProjectImage({
    imageUrl: candidate.url,
    projectId: candidate.projectId,
    altText: form.altText,
    caption: form.caption,
    sortOrder: form.sortOrder
  })

  if (!result.success) {
    errorMessage.value = result.error || 'Unable to add project image.'
    return
  }

  successMessage.value = 'Project image added to gallery.'
  // Reset form for this card
  projectImageForms[candidate.url] = {
    altText: '',
    caption: '',
    sortOrder: 0
  }
}

const handleStandaloneUpload = async (): Promise<void> => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!standaloneFile.value) {
    errorMessage.value = 'Select an image to upload.'
    return
  }
  if (!standaloneAltText.value) {
    errorMessage.value = 'Alt text is required for accessibility.'
    return
  }

  const result = await galleryStore.uploadStandaloneImage({
    file: standaloneFile.value,
    altText: standaloneAltText.value,
    caption: standaloneCaption.value,
    sortOrder: standaloneSortOrder.value
  })

  if (!result.success) {
    errorMessage.value = result.error || 'Failed to upload standalone image.'
    return
  }

  successMessage.value = 'Standalone image uploaded to gallery.'
  standaloneFile.value = null
  standalonePreview.value = ''
  standaloneAltText.value = ''
  standaloneCaption.value = ''
  standaloneSortOrder.value = 0
}

const handleDelete = async (item: GalleryItem): Promise<void> => {
  errorMessage.value = ''
  successMessage.value = ''
  const result = await galleryStore.deleteGalleryItem(item.id)
  if (!result.success) {
    errorMessage.value = result.error || 'Failed to remove gallery item.'
    return
  }
  successMessage.value = 'Gallery item removed.'
}

const saveSortOrder = async (item: GalleryItem): Promise<void> => {
  const next = sortOrderDraft[item.id]
  if (next === undefined || Number.isNaN(next)) {
    errorMessage.value = 'Enter a valid sort order before saving.'
    return
  }
  const result = await galleryStore.updateSortOrder(item.id, next)
  if (!result.success) {
    errorMessage.value = result.error || 'Failed to update sort order.'
    return
  }
  successMessage.value = 'Sort order updated.'
  sortOrderDraft[item.id] = undefined
}

const handleLogout = async (): Promise<void> => {
  try {
    await supabaseClient.auth.signOut()
    navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(async () => {
  await refreshData()
})

useHead({
  title: 'Manage Gallery - Admin - Thapa Construction',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

// TODO: Add automated tests for cap enforcement and duplicate prevention once test runner is configured.
</script>
