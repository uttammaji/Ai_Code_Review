// frontend/src/api/github.js
import apiClient from './axios';

export const githubApi = {
  getAuthUrl: () => {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    return `${baseUrl}/github/auth`;
  },

  connectGitHub: async (githubData) => {
    console.log('connectGitHub called with:', githubData);
    console.log('Token:', localStorage.getItem('token'));
    
    try {
      const res = await apiClient.post('/github/connect', githubData);
      console.log('connectGitHub response:', res.data);
      return res.data;
    } catch (error) {
      console.error('connectGitHub error:', error.response?.data || error.message);
      console.error(' Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      throw error;
    }
  },

  getGitHubUser: async () => {
    const res = await apiClient.get('/github/user');
    return res.data;
  },

  getRepositories: async () => {
    const res = await apiClient.get('/github/repos');
    return res.data;
  },

  getBranches: async (owner, repo) => {
    const res = await apiClient.get(`/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`);
    return res.data;
  },

  getRepositoryTree: async (owner, repo, branch = 'main') => {
    const res = await apiClient.get(
      `/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tree`,
      { params: { branch } }
    );
    return res.data;
  },

  getRepositoryFile: async (owner, repo, path, branch = 'main') => {
    const res = await apiClient.get(
      `/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/file`,
      { params: { path, branch } }
    );
    return res.data;
  },

  reviewRepository: async (owner, repo, branch = 'main') => {
    const res = await apiClient.post('/github/review', { owner, repo, branch });
    return res.data;
  },

  disconnectGitHub: async () => {
    const res = await apiClient.delete('/github/disconnect');
    return res.data;
  }
};

export default githubApi;
