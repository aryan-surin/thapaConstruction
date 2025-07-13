import { defineStore } from 'pinia'
import { projects as projectsData } from '~/data/projects'

/**
 * Pinia store for managing project data.
 * Provides getters for all projects, categories, filtering, and featured project.
 */
export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: projectsData
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
  }
})