import { defineStore } from 'pinia'

export type GallerySourceType = 'project' | 'standalone'

export interface GalleryItem {
  id: string
  image_url: string
  source_type: GallerySourceType
  project_id: string | null
  alt_text: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface AddProjectImagePayload {
  imageUrl: string
  projectId: string
  altText: string
  caption?: string
  sortOrder?: number
}

export interface UploadStandalonePayload {
  file: File
  altText: string
  caption?: string
  sortOrder?: number
}

interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
}

export const useGalleryStore = defineStore('gallery', {
  state: () => ({
    items: [] as GalleryItem[],
    loading: false,
    error: null as string | null
  }),
  getters: {
    allItems: (state): GalleryItem[] => state.items,
    totalCount: (state): number => state.items.length,
    standaloneCount: (state): number => state.items.filter((i) => i.source_type === 'standalone').length,
    projectCount: (state): number => state.items.filter((i) => i.source_type === 'project').length,
    totalLimitReached(): boolean {
      return this.totalCount >= 30
    },
    standaloneLimitReached(): boolean {
      return this.standaloneCount >= 5
    }
  },
  actions: {
    async fetchGalleryItems(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const { $supabase } = useNuxtApp()
        const { data, error } = await $supabase
          .from('gallery_items')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true })

        if (error) throw error
        this.items = (data || []) as GalleryItem[]
      } catch (err: any) {
        this.error = err.message || 'Failed to load gallery items'
        console.error('Error fetching gallery:', err)
      } finally {
        this.loading = false
      }
    },

    isDuplicate(sourceType: GallerySourceType, imageUrl: string): boolean {
      return this.items.some((i) => i.source_type === sourceType && i.image_url === imageUrl)
    },

    ensureCaps(sourceType: GallerySourceType): ActionResult<GalleryItem> {
      if (this.totalCount >= 30) {
        return { success: false, error: 'Gallery cap reached (30 items max)' }
      }
      if (sourceType === 'standalone' && this.standaloneCount >= 5) {
        return { success: false, error: 'Standalone cap reached (5 items max)' }
      }
      return { success: true }
    },

    async addProjectImage(payload: AddProjectImagePayload): Promise<ActionResult<GalleryItem>> {
      try {
        const capCheck = this.ensureCaps('project')
        if (!capCheck.success) return capCheck
        if (this.isDuplicate('project', payload.imageUrl)) {
          return { success: false, error: 'This project image is already in the gallery' }
        }

        const { $supabase } = useNuxtApp()
        const { data, error } = await $supabase
          .from('gallery_items')
          .insert({
            image_url: payload.imageUrl,
            source_type: 'project',
            project_id: payload.projectId,
            alt_text: payload.altText,
            caption: payload.caption || null,
            sort_order: payload.sortOrder ?? 0
          })
          .select()
          .single()

        if (error) {
          if (error.code === '23505') {
            return { success: false, error: 'Duplicate project image detected (unique constraint)' }
          }
          throw error
        }

        const newItem = data as GalleryItem
        this.items.push(newItem)
        this.items.sort((a, b) => (a.sort_order - b.sort_order) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        return { success: true, data: newItem }
      } catch (err: any) {
        console.error('Error adding project image to gallery:', err)
        return { success: false, error: err.message || 'Failed to add project image' }
      }
    },

    async uploadStandaloneImage(payload: UploadStandalonePayload): Promise<ActionResult<GalleryItem>> {
      try {
        const capCheck = this.ensureCaps('standalone')
        if (!capCheck.success) return capCheck

        const { $supabase } = useNuxtApp()
        const fileExt = payload.file.name.split('.').pop()
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
        const storagePath = `gallery/standalone/${uniqueName}`

        const { error: uploadError } = await $supabase.storage
          .from('project-images')
          .upload(storagePath, payload.file)

        if (uploadError) throw uploadError

        const { data: urlData } = $supabase.storage
          .from('project-images')
          .getPublicUrl(storagePath)

        const publicUrl = urlData?.publicUrl
        if (!publicUrl) {
          return { success: false, error: 'Failed to resolve public URL after upload' }
        }

        const { data, error } = await $supabase
          .from('gallery_items')
          .insert({
            image_url: publicUrl,
            source_type: 'standalone',
            project_id: null,
            alt_text: payload.altText,
            caption: payload.caption || null,
            sort_order: payload.sortOrder ?? 0
          })
          .select()
          .single()

        if (error) throw error

        const newItem = data as GalleryItem
        this.items.push(newItem)
        this.items.sort((a, b) => (a.sort_order - b.sort_order) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        return { success: true, data: newItem }
      } catch (err: any) {
        console.error('Error uploading standalone gallery image:', err)
        return { success: false, error: err.message || 'Failed to upload standalone image' }
      }
    },

    async deleteGalleryItem(id: string): Promise<ActionResult<null>> {
      try {
        const { $supabase } = useNuxtApp()
        const { error } = await $supabase
          .from('gallery_items')
          .delete()
          .eq('id', id)

        if (error) throw error
        this.items = this.items.filter((item) => item.id !== id)
        return { success: true }
      } catch (err: any) {
        console.error('Error deleting gallery item:', err)
        return { success: false, error: err.message || 'Failed to delete gallery item' }
      }
    },

    async updateSortOrder(id: string, sortOrder: number): Promise<ActionResult<GalleryItem>> {
      try {
        const { $supabase } = useNuxtApp()
        const { data, error } = await $supabase
          .from('gallery_items')
          .update({ sort_order: sortOrder })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        const updated = data as GalleryItem
        this.items = this.items.map((item) => (item.id === id ? updated : item))
        this.items.sort((a, b) => (a.sort_order - b.sort_order) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        return { success: true, data: updated }
      } catch (err: any) {
        console.error('Error updating sort order:', err)
        return { success: false, error: err.message || 'Failed to update sort order' }
      }
    }
  }
})
