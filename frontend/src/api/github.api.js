import apiClient from './axios';

export const githubApi = {
    connectGitHub: async (githubData) => {
        console.log('📤 Sending to connect:', githubData);
        const res = await apiClient.post('/github/connect', githubData);
        return res.data;
    },

    getGitHubUser: async () => {
        const res = await apiClient.get('/github/user');
        return res.data;
    },

    getRepositories: async () => {
        const res = await apiClient.get('/github/repos');
        return res.data;
    },

    disconnectGitHub: async () => {
        const res = await apiClient.delete('/github/disconnect');
        return res.data;
    }
};

export default githubApi;
