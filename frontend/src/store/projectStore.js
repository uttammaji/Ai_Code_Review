import { create } from 'zustand';
import { projectApi } from '../api/project.api';

export const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const res = await projectApi.getProjects();
      set({ projects: res.projects || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || err.message || 'Failed to fetch projects', loading: false });
    }
  },

  fetchProjectById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await projectApi.getProject(id);
      set({ selectedProject: res.project, loading: false });
      return res.project;
    } catch (err) {
      set({ error: err.response?.data?.error || err.message || 'Project not found', loading: false });
      return null;
    }
  },

  createProject: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await projectApi.createProject(data);
      const newProj = res.project;
      set((state) => ({ projects: [newProj, ...state.projects], loading: false }));
      return newProj;
    } catch (err) {
      set({ error: err.response?.data?.error || err.message || 'Failed to create project', loading: false });
      throw err;
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await projectApi.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.error || err.message || 'Failed to delete project', loading: false });
    }
  },

  selectProject: (project) => set({ selectedProject: project }),
}));

export default useProjectStore;
