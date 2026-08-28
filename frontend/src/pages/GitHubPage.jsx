import React, { useEffect, useState, useMemo } from 'react';
import { useGitHubStore } from '../store/githubStore';
import { useUIStore } from '../store/uiStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Github,
  Search,
  Star,
  GitFork,
  CheckCircle2,
  Unlink,
  RefreshCw,
  ExternalLink,
  GitBranch,
  Code2,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const GitHubPage = () => {
  const {
    connected,
    user,
    repositories,
    fetchStatus,
    fetchRepositories,
    loadRepositoryTree,
    connect,
    disconnect,
    loading,
  } = useGitHubStore();
  const { setActiveSection, addNotification } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLang, setSelectedLang] = useState('ALL');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const connection = searchParams.get('connection');
    if (!connection) return;

    addNotification({
      title: 'GitHub',
      message: connection === 'success' ? 'GitHub account connected successfully' : 'GitHub connection failed',
      type: connection === 'success' ? 'success' : 'error',
    });
    setSearchParams({}, { replace: true });
  }, [addNotification, searchParams, setSearchParams]);

  useEffect(() => {
    if (connected) {
      fetchRepositories();
    }
  }, [connected, fetchRepositories]);

  const filteredRepos = useMemo(() => {
    return repositories.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLang = selectedLang === 'ALL' || r.language === selectedLang;
      return matchesSearch && matchesLang;
    });
  }, [repositories, searchTerm, selectedLang]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-8 space-y-6 bg-[#0d1117]">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
            <Github className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                GitHub Synchronization
              </h1>
              <Badge
                variant={connected ? 'success' : 'default'}
                size="sm"
                className={connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-400'}
              >
                {connected ? 'Sync Active' : 'Disconnected'}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Import repositories directly from GitHub for automated pull request and branch reviews.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {connected ? (
            <Button
              variant="outline"
              size="sm"
              icon={<Unlink className="w-4 h-4" />}
              onClick={disconnect}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<Github className="w-4 h-4" />}
              onClick={connect}
              loading={loading}
              className="shadow-lg shadow-purple-500/20"
            >
              Connect GitHub
            </Button>
          )}
        </div>
      </div>

      {/* Repositories Section */}
      {connected && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search connected repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#161b22] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
              onClick={fetchRepositories}
            >
              Sync Repos
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                onClick={async () => {
                  await loadRepositoryTree(repo);
                  setActiveSection('review');
                  navigate('/review');
                }}
                className="p-5 bg-[#161b22]/70 border border-white/10 hover:border-purple-500/40 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-sm text-white truncate">{repo.name}</h3>
                  <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {repo.stars || 0}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-4">{repo.description || 'GitHub repository'}</p>
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                  <span>{repo.language || 'Code'}</span>
                  <span className="text-blue-400 flex items-center gap-1">
                    <Code2 className="w-3 h-3" /> Review in IDE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubPage;
