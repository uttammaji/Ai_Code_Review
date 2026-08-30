import { create } from 'zustand';
import { githubApi } from '../api/github.js';

export const useGitHubStore = create((set, get) => ({
    connected: false,
    user: null,
    repositories: [],
    selectedRepo: null,
    branches: ['main'],
    selectedBranch: 'main',
    repositoryFiles: [],
    repositoryLoading: false,
    loading: false,
    error: null,

    fetchStatus: async () => {
        try {
            const data = await githubApi.getGitHubUser();
            set({ 
                connected: Boolean(data.connected), 
                user: data.user || null, 
                error: null 
            });
        } catch (err) {
            set({ 
                connected: false, 
                user: null, 
                error: err.response?.data?.message || 'Failed to fetch GitHub status' 
            });
        }
    },

    fetchRepositories: async () => {
        set({ loading: true, error: null });
        try {
            const data = await githubApi.getRepositories();
            set({ 
                repositories: data.repositories || [], 
                loading: false 
            });
        } catch (err) {
            set({ 
                error: err.response?.data?.message || 'Failed to fetch repositories', 
                loading: false 
            });
        }
    },

    connect: async () => {
        set({ loading: true });
        try {
            window.location.href = '/api/github/auth';
        } catch (err) {
            set({ 
                loading: false, 
                error: err.response?.data?.message || 'Failed to connect GitHub' 
            });
        }
    },

    saveConnection: async (githubData) => {
        set({ loading: true, error: null });
        try {
            const response = await githubApi.connectGitHub(githubData);
            set({ 
                connected: true, 
                user: response.user || null, 
                loading: false,
                error: null 
            });
            await get().fetchRepositories();
            return response;
        } catch (err) {
            set({ 
                loading: false, 
                error: err.response?.data?.message || 'Failed to save GitHub connection' 
            });
            throw err;
        }
    },

    disconnect: async () => {
        set({ loading: true });
        try {
            await githubApi.disconnectGitHub();
            set({ 
                connected: false, 
                user: null, 
                repositories: [], 
                repositoryFiles: [], 
                selectedRepo: null, 
                loading: false 
            });
        } catch (err) {
            set({ 
                loading: false, 
                error: err.response?.data?.message || 'Failed to disconnect GitHub' 
            });
        }
    },

    setSelectedRepo: (repo) => set({ selectedRepo: repo }),
    setSelectedBranch: (branch) => set({ selectedBranch: branch }),
    clearError: () => set({ error: null }),
}));

export default useGitHubStore;
