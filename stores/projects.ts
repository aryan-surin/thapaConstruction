import { defineStore } from 'pinia'

/**
 * Pinia store for managing project data from Supabase.
 * Provides getters for all projects, categories, filtering, and featured project.
 * Includes actions for CRUD operations (admin use).
 */
export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as any[],
    loading: false,
    error: null as string | null
  }),
  getters: {
    allProjects: (state) => state.projects,
    categories: (state) => [...new Set(state.projects.map(p => p.category))],
    featuredProject: (state) => state.projects.find(p => p.featured),
    /**
     * Returns projects filtered by category.
     * @param category - The category to filter by.
     * @returns Filtered projects array.
     */
    filteredProjects: (state) => (category: string) =>
      category === 'all'
        ? state.projects
        : state.projects.filter(p => p.category === category)
  },
  actions: {
    /**
     * Fetch all projects from Supabase
     */
    async fetchProjects() {
      this.loading = true
      this.error = null
      
      try {
        const { $supabase } = useNuxtApp()
        const { data, error } = await $supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        this.projects = data || []
      } catch (err: any) {
        this.error = err.message
        console.error('Error fetching projects:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * Get a single project by ID
     */
    async fetchProjectById(id: string) {
      try {
        const { $supabase } = useNuxtApp()
        const { data, error } = await $supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return data
      } catch (err: any) {
        console.error('Error fetching project:', err)
        return null
      }
    },

    /**
     * Create a new project (Admin only)
     */
    async createProject(projectData: any) {
      try {
        const { $supabase } = useNuxtApp()
        const { data, error } = await $supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single()

        if (error) throw error

        // Add to local state
        this.projects.unshift(data)
        return { success: true, data }
      } catch (err: any) {
        console.error('Error creating project:', err)
        return { success: false, error: err.message }
      }
    },

    /**
     * Update an existing project (Admin only)
     */
    async updateProject(id: string, projectData: any) {
      try {
        const { $supabase } = useNuxtApp()
        const { data, error } = await $supabase
          .from('projects')
          .update({ ...projectData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        // Update local state
        const index = this.projects.findIndex(p => p.id === id)
        if (index !== -1) {
          this.projects[index] = data
        }
        return { success: true, data }
      } catch (err: any) {
        console.error('Error updating project:', err)
        return { success: false, error: err.message }
      }
    },

    /**
     * Delete a project (Admin only)
     */
    async deleteProject(id: string) {
      try {
        const { $supabase } = useNuxtApp()
        const { error } = await $supabase
          .from('projects')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Remove from local state
        this.projects = this.projects.filter(p => p.id !== id)
        return { success: true }
      } catch (err: any) {
        console.error('Error deleting project:', err)
        return { success: false, error: err.message }
      }
    },

    /**
     * Upload image to Supabase Storage
     */
    async uploadImage(file: File, path: string) {
      try {
        const { $supabase } = useNuxtApp()
        
        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${path}/${fileName}`

        const { data, error } = await $supabase.storage
          .from('project-images')
          .upload(filePath, file)

        if (error) throw error

        // Get public URL
        const { data: { publicUrl } } = $supabase.storage
          .from('project-images')
          .getPublicUrl(filePath)

        return { success: true, url: publicUrl }
      } catch (err: any) {
        console.error('Error uploading image:', err)
        return { success: false, error: err.message }
      }
    },

    /**
     * Delete image from Supabase Storage
     */
    async deleteImage(url: string) {
      try {
        const { $supabase } = useNuxtApp()
        
        // Extract file path from URL
        const urlParts = url.split('/project-images/')
        if (urlParts.length < 2) return { success: false, error: 'Invalid URL' }
        
        const filePath = urlParts[1]

        const { error } = await $supabase.storage
          .from('project-images')
          .remove([filePath])

        if (error) throw error
        return { success: true }
      } catch (err: any) {
        console.error('Error deleting image:', err)
        return { success: false, error: err.message }
      }
    }
  }
})