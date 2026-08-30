import apiClient from './axios';

export const githubApi = {
    // GitHub OAuth
    getAuthUrl: () => {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        return `${baseUrl}/github/auth`;
    },

    // Connect GitHub account (save to database)
    connectGitHub: async (githubData) => {
        console.log('📤 Sending to connect:', githubData);
        const res = await apiClient.post('/github/connect', githubData);
        return res.data;
    },

    // Get GitHub user data
    getGitHubUser: async () => {
        const res = await apiClient.get('/github/user');
        return res.data;
    },

    // Get repositories
    getRepositories: async () => {
        const res = await apiClient.get('/github/repos');
        return res.data;
    },

    // Get branches for a repository
    getBranches: async (owner, repo) => {
        const res = await apiClient.get(`/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`);
        return res.data;
    },

    // Get repository tree/contents
    getRepositoryTree: async (owner, repo, branch = 'main') => {
        const res = await apiClient.get(
            `/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tree`,
            { params: { branch } }
        );
        return res.data;
    },

    // Get repository file content
    getRepositoryFile: async (owner, repo, path, branch = 'main') => {
        const res = await apiClient.get(
            `/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/file`,
            { params: { path, branch } }
        );
        return res.data;
    },

    // Review repository
    reviewRepository: async (owner, repo, branch = 'main') => {
        const res = await apiClient.post('/github/review', { owner, repo, branch });
        return res.data;
    },

    // Disconnect GitHub
    disconnectGitHub: async () => {
        const res = await apiClient.delete('/github/disconnect');
        return res.data;
    }
};

export default githubApi;
