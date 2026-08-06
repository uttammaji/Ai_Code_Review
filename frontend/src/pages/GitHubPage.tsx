import React, { useEffect, useState, useMemo } from 'react';
import { useGitHubStore } from '../store/githubStore';
import { useUIStore } from '../store/uiStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Github,
  Search,
  GitBranch,
  Star,
  GitFork,
  Sparkles,
  CheckCircle2,
  Unlink,
  RefreshCw,
  ExternalLink,
  Clock,
  Users,
  FolderGit2,
  ShieldCheck,
  Zap,
  ChevronRight,
  AlertCircle,
  Plus,
  Filter,
  X,
  BookOpen,
  Code2,
  Globe
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const GitHubPage: React.FC = () => {
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
    error
  } = useGitHubStore();
  const { setActiveSection, addNotification } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLang, setSelectedLang] = useState('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'stars' | 'name'>('recent');
  const [showFilters, setShowFilters] = useState(false);
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
      message: connection === 'success' ? 'GitHub account connected successfully' : 'GitHub connection was cancelled or failed',
      type: connection === 'success' ? 'success' : 'error',
    });
    setSearchParams({}, { replace: true });
  }, [addNotification, searchParams, setSearchParams]);

  useEffect(() => {
    if (connected) {
      fetchRepositories();
    }
  }, [connected, fetchRepositories]);

  // Get unique languages for filter
  const languages = useMemo(() => {
    const langs = new Set(repositories.map(r => r.language).filter(Boolean));
    return ['ALL', ...Array.from(langs)].sort();
  }, [repositories]);

  // Sort and filter repositories
  const filteredRepos = useMemo(() => {
    let filtered = repositories.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLang = selectedLang === 'ALL' || r.language === selectedLang;
      return matchesSearch && matchesLang;
    });

    // Sort
    switch (sortBy) {
      case 'stars':
        filtered = filtered.sort((a, b) => b.stars - a.stars);
        break;
      case 'name':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
      default:
        filtered = filtered.sort((a, b) => b.updated_at?.localeCompare(a.updated_at) || 0);
        break;
    }

    return filtered;
  }, [repositories, searchTerm, selectedLang, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalRepos = repositories.length;
    const totalStars = repositories.reduce((acc, r) => acc + r.stars, 0);
    const totalForks = repositories.reduce((acc, r) => acc + r.forks, 0);
    const primaryLanguage = repositories.reduce((acc, r) => {
      if (r.language) acc[r.language] = (acc[r.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLang = Object.entries(primaryLanguage).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return { totalRepos, totalStars, totalForks, topLang };
  }, [repositories]);

  // Handle repository open
  const handleOpenRepository = async (repo: any) => {
    try {
      addNotification({
        title: 'GitHub',
        message: `Opening ${repo.name} in the Explorer…`,
        type: 'info'
      });
      await loadRepositoryTree(repo);
      setActiveSection('review');
      navigate('/review');
    } catch (err: any) {
      addNotification({
        title: 'GitHub',
        message: err?.response?.data?.message || 'Failed to open repository files',
        type: 'error'
      });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLang('ALL');
    setSortBy('recent');
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-[#161b22]">
      {/* Enhanced Header with gradient border */}
      <div className="relative overflow-hidden p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-[#30363d] rounded-xl">
                <Github className="w-7 h-7 text-white" />
              </div>
              {connected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#161b22] animate-pulse"></div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  GitHub Integration
                </h1>
                {connected ? (
                  <Badge variant="success" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="warning" size="sm" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Disconnected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                {connected && user?.login ? (
                  <>
                    <span className="font-medium text-white">@{user.login}</span>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {stats.totalRepos} repositories
                    </span>
                  </>
                ) : (
                  'Connect your GitHub account to review repositories and pull requests'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {connected ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<RefreshCw className="w-4 h-4" />}
                  loading={loading}
                  onClick={() => fetchRepositories()}
                  className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]"
                >
                  Refresh
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Unlink className="w-4 h-4 text-rose-400" />}
                  loading={loading}
                  onClick={async () => {
                    await disconnect();
                    addNotification({ title: 'GitHub', message: 'Account disconnected', type: 'info' });
                  }}
                  className="border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10"
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="lg"
                icon={<Github className="w-4 h-4" />}
                loading={loading}
                onClick={async () => {
                  await connect();
                }}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Connect GitHub Account</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            )}
          </div>
        </div>

        {/* Stats row when connected */}
        {connected && (
          <div className="relative mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#30363d]">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-sm font-bold text-white">{stats.totalRepos}</div>
                <div className="text-[10px] text-gray-500">Repositories</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-sm font-bold text-white">{stats.totalStars}</div>
                <div className="text-[10px] text-gray-500">Total Stars</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-sm font-bold text-white">{stats.totalForks}</div>
                <div className="text-[10px] text-gray-500">Total Forks</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-sm font-bold text-white">{stats.topLang}</div>
                <div className="text-[10px] text-gray-500">Primary Language</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="relative overflow-hidden rounded-xl border border-rose-800/60 bg-gradient-to-br from-rose-950/40 to-rose-900/20 px-4 py-3 text-xs text-rose-200 animate-slideDown">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">GitHub connection issue: </span>
              <span>{error}</span>
              <button
                onClick={() => fetchStatus()}
                className="ml-2 text-rose-400 hover:text-rose-300 underline underline-offset-2 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {connected ? (
        <div className="space-y-4">
          {/* Enhanced Controls & Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] rounded-xl pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl border transition-all ${showFilters ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-[#161b22] border-[#30363d] text-gray-400 hover:text-white'
                  }`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {languages.slice(0, 6).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all whitespace-nowrap ${selectedLang === lang
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-[#161b22] text-gray-400 border-[#30363d] hover:border-gray-500 hover:text-white'
                      }`}
                  >
                    {lang === 'ALL' ? 'All' : lang}
                  </button>
                ))}
                {languages.length > 6 && (
                  <button className="px-2.5 py-1 rounded-lg text-xs bg-[#161b22] text-gray-400 border border-[#30363d] hover:text-white">
                    +{languages.length - 6}
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="recent">Recent</option>
                <option value="stars">Most Stars</option>
                <option value="name">Alphabetical</option>
              </select>

              {(searchTerm || selectedLang !== 'ALL' || sortBy !== 'recent') && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Repository Cards Grid */}
          {filteredRepos.length === 0 ? (
            <div className="text-center py-12 bg-[#161b22] border border-[#30363d] rounded-2xl">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-[#0d1117] rounded-full border border-[#30363d]">
                  <Search className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-200">No repositories found</h3>
                <p className="text-xs text-gray-400 max-w-sm">
                  {searchTerm || selectedLang !== 'ALL'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Connect your GitHub account to see your repositories'}
                </p>
                {(searchTerm || selectedLang !== 'ALL') && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="group p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] hover:border-[#30363d] rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-opacity-10 hover:-translate-y-1 flex flex-col"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors font-mono truncate flex-1">
                        {repo.full_name}
                      </h3>
                      {repo.language && (
                        <Badge variant="info" size="sm" className="flex-shrink-0 bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {repo.language}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                      {repo.description || (
                        <span className="text-gray-500 italic">No description available</span>
                      )}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#30363d]/60 flex items-center justify-between text-xs text-gray-400 font-mono">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                        <Star className="w-3.5 h-3.5 text-amber-400" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                        <GitFork className="w-3.5 h-3.5 text-blue-400" /> {repo.forks}
                      </span>
                      {repo.private && (
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                          Private
                        </span>
                      )}
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Sparkles className="w-3.5 h-3.5 text-blue-400" />}
                      onClick={() => handleOpenRepository(repo)}
                      className="hover:bg-blue-500/10 hover:border-blue-500/20 transition-all"
                    >
                      Open
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Repository count */}
          <div className="text-center text-xs text-gray-500 pt-2">
            Showing {filteredRepos.length} of {repositories.length} repositories
          </div>
        </div>
      ) : (
        // Enhanced Empty State
        <div className="relative overflow-hidden p-12 text-center bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

          <div className="relative space-y-4">
            <div className="inline-flex p-4 bg-[#0d1117] rounded-full border border-[#30363d]">
              <Github className="w-16 h-16 text-gray-500" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200">Connect Your GitHub Account</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
                Authorize AI Code Review to access your repositories and enable automated security reviews for your codebase.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-4">
              <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs text-gray-300 font-medium block">Secure Access</span>
                <span className="text-[10px] text-gray-500">OAuth authentication</span>
              </div>
              <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                <Zap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="text-xs text-gray-300 font-medium block">Instant Review</span>
                <span className="text-[10px] text-gray-500">AI-powered analysis</span>
              </div>
              <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <span className="text-xs text-gray-300 font-medium block">Public & Private</span>
                <span className="text-[10px] text-gray-500">All repositories</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={<Github className="w-5 h-5" />}
                loading={loading}
                onClick={() => connect()}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Connect GitHub Account</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <p className="text-[10px] text-gray-600 mt-2">
                <Globe className="w-3 h-3 inline mr-1" />
                We never store your code, only analyze it securely
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};