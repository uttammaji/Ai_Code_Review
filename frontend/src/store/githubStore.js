import { create } from 'zustand';
import { githubApi } from '../api/github';

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
      set({ connected: Boolean(data.connected), user: data.user || null, error: null });
    } catch (err) {
      set({ connected: false, user: null, error: err.response?.data?.message || 'Failed to fetch GitHub status' });
    }
  },

  fetchRepositories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await githubApi.getRepositories();
      set({ repositories: data.repositories || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch repositories', loading: false });
    }
  },

  fetchBranches: async (owner, repo) => {
    try {
      const data = await githubApi.getBranches(owner, repo);
      set({ branches: data.branches || ['main'], selectedBranch: data.branches?.[0] || 'main' });
    } catch {
      set({ branches: ['main', 'develop'] });
    }
  },

  loadRepositoryTree: async (repo) => {
    const [owner, repository] = (repo.full_name || '').split('/');
    if (!owner || !repository) throw new Error('Invalid GitHub repository name');
    set({ repositoryLoading: true, error: null, selectedRepo: repo, selectedBranch: repo.default_branch || 'main' });
    try {
      const data = await githubApi.getRepositoryTree(owner, repository, repo.default_branch);
      const root = [];
      for (const entry of data.files || []) {
        const parts = entry.path.split('/').filter(Boolean);
        let level = root;
        let currentPath = '';
        parts.forEach((part, index) => {
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          const isFile = index === parts.length - 1;
          let item = level.find((node) => node.path === currentPath);
          if (!item) {
            item = {
              id: `github-${currentPath}`,
              name: part,
              path: currentPath,
              type: isFile ? 'file' : 'folder',
              language: undefined,
              children: isFile ? undefined : [],
            };
            level.push(item);
          }
          if (!isFile && item.children) level = item.children;
        });
      }
      set({ repositoryFiles: root, repositoryLoading: false });
    } catch (err) {
      set({ repositoryFiles: [], repositoryLoading: false, error: err.response?.data?.message || 'Unable to load repository files' });
      throw err;
    }
  },

  openRepositoryFile: async (file) => {
    const repo = get().selectedRepo;
    const branch = get().selectedBranch;
    if (!repo) throw new Error('Select a repository first');
    const [owner, repository] = (repo.full_name || '').split('/');
    const data = await githubApi.getRepositoryFile(owner, repository, file.path, branch);
    const extension = file.name.split('.').pop()?.toLowerCase();
    const languageMap = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      cc: 'cpp',
      go: 'go',
      rs: 'rust',
      json: 'json',
      html: 'html',
      css: 'css',
    };
    return { ...file, language: languageMap[extension || ''] || 'plaintext', content: data.content };
  },

  connect: async () => {
    set({ loading: true });
    try {
      const data = await githubApi.connectGitHub();
      if (data.authorizationUrl) {
        window.location.assign(data.authorizationUrl);
      }
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to connect GitHub' });
    }
  },

  disconnect: async () => {
    set({ loading: true });
    try {
      await githubApi.disconnectGitHub();
      set({ connected: false, user: null, repositories: [], repositoryFiles: [], selectedRepo: null, loading: false });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to disconnect GitHub' });
    }
  },

  setSelectedRepo: (repo) => set({ selectedRepo: repo }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
}));

export default useGitHubStore;
