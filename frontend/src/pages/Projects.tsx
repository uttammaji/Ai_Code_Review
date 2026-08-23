import React, { useEffect, useState, useMemo } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useUIStore } from '../store/uiStore';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Search,
  Code2,
  Settings,
  Trash2,
  GitBranch,
  CheckCircle2,
  Layers,
  TrendingUp,
  Grid3x3,
  Table,
  AlertCircle,
  ShieldCheck,
  X
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const Projects: React.FC = () => {
  const { projects, fetchProjects, deleteProject, selectProject } = useProjectStore();
  const { setActiveSection, addNotification } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'reviews'>('name');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects().finally(() => setLoading(false));
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.repository.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.language.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      switch (selectedFilter) {
        case 'healthy': 
          return p.status === 'Healthy';
        case 'warning': 
          return p.status === 'Needs Attention';
        case 'critical': 
          return p.status === 'Critical Issues';
        default: 
          return true;
      }
    });

    switch (sortBy) {
      case 'score':
        filtered = filtered.sort((a, b) => b.score - a.score);
        break;
      case 'reviews':
        filtered = filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
      case 'name':
      default:
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [projects, searchTerm, selectedFilter, sortBy]);

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete project "${name}"? This action cannot be undone.`)) {
      await deleteProject(id);
      addNotification({
        title: 'Project Deleted',
        message: `Successfully deleted "${name}"`,
        type: 'info'
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.size === 0) return;
    if (window.confirm(`Delete ${selectedProjects.size} selected projects?`)) {
      await Promise.all(Array.from(selectedProjects).map(id => deleteProject(id as string)));
      setSelectedProjects(new Set());
      addNotification({
        title: 'Projects Deleted',
        message: `Deleted ${selectedProjects.size} projects`,
        type: 'info'
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedProjects.size === filteredProjects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(filteredProjects.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedProjects);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedProjects(newSet);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFilter('all');
    setSortBy('name');
  };

  const stats = useMemo(() => {
    const total = projects.length;
    const healthy = projects.filter(p => p.status === 'Healthy').length;
    const warning = projects.filter(p => p.status === 'Needs Attention').length;
    const critical = projects.filter(p => p.status === 'Critical Issues').length;
    const avgScore = total > 0 ? Math.round(projects.reduce((acc, p) => acc + p.score, 0) / total) : 0;
    return { total, healthy, warning, critical, avgScore };
  }, [projects]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Healthy': 
        return CheckCircle2;
      case 'Needs Attention': 
        return AlertCircle;
      case 'Critical Issues': 
        return AlertCircle;
      default: 
        return ShieldCheck;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500/20 border-t-blue-500"></div>
          <p className="text-sm text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 bg-[#0d1117]">
      {/* Header */}
      <div className="relative overflow-hidden p-6 bg-[#161b22] border border-[#30363d] rounded-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <FolderGit2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Projects Explorer
                <Badge variant="info" size="sm" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {stats.total} repositories
                </Badge>
              </h1>
              <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-2">
                <Layers className="w-3 h-3" />
                Manage your connected codebases and trigger AI reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setActiveSection('github');
                navigate('/github');
              }}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">Add Project</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="p-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg transition-all text-gray-400 hover:text-white"
              title={viewMode === 'table' ? 'Grid view' : 'Table view'}
            >
              {viewMode === 'table' ? (
                <Grid3x3 className="w-4 h-4" />
              ) : (
                <Table className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#30363d]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{stats.healthy}</div>
              <div className="text-[10px] text-gray-500">Healthy</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-400">{stats.warning}</div>
              <div className="text-[10px] text-gray-500">Needs Attention</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-400">{stats.critical}</div>
              <div className="text-[10px] text-gray-500">Critical</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{stats.avgScore}%</div>
              <div className="text-[10px] text-gray-500">Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects, repositories, or languages..."
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
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          <div className="flex items-center gap-1 bg-[#161b22] border border-[#30363d] rounded-lg p-1">
            {['all', 'healthy', 'warning', 'critical'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
                }`}
              >
                {filter === 'all' ? 'All' :
                  filter === 'healthy' ? 'Healthy' :
                    filter === 'warning' ? 'Warning' : 'Critical'}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
          >
            <option value="name">Name</option>
            <option value="score">Highest Score</option>
            <option value="reviews">Most Reviews</option>
          </select>

          {(searchTerm || selectedFilter !== 'all' || sortBy !== 'name') && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedProjects.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-[#161b22] border border-[#30363d] rounded-xl">
          <span className="text-sm text-gray-300">
            <span className="font-bold text-white">{selectedProjects.size}</span> projects selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProjects(new Set())}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Deselect all
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-xs font-medium transition-all"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Projects Display */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#0d1117] border-b border-[#30363d]">
                <th className="p-4 w-8">
                  <input
                    type="checkbox"
                    checked={selectedProjects.size === filteredProjects.length && filteredProjects.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-[#30363d] bg-[#0d1117] text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                </th>
                <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">Project</th>
                <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">Repository</th>
                <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">Language</th>
                <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">Reviews</th>
                <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">Score</th>
                <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]/40">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-[#0d1117] rounded-full border border-[#30363d]">
                        <Search className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-gray-400">No projects found</p>
                      <p className="text-xs text-gray-500">Try adjusting your filters or search terms</p>
                      <button
                        onClick={clearFilters}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => {
                  const StatusIcon = getStatusIcon(proj.status);
                  return (
                    <tr
                      key={proj.id}
                      onClick={() => {
                        selectProject(proj);
                        navigate(`/projects/${proj.id}`);
                      }}
                      className="hover:bg-[#21262d] transition-colors cursor-pointer group"
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedProjects.has(proj.id)}
                          onChange={() => toggleSelect(proj.id)}
                          className="rounded border-[#30363d] bg-[#0d1117] text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="font-semibold text-gray-200">{proj.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-gray-400 text-xs">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          {proj.repository}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant="info" size="sm" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {proj.language}
                        </Badge>
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-gray-200">
                        {proj.reviewsCount || 0}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-lg font-bold font-mono ${getScoreColor(proj.score)}`}>
                          {proj.score}%
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={proj.status === 'Healthy' ? 'success' : 'warning'}
                          size="sm"
                          className={proj.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {proj.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              selectProject(proj);
                              setActiveSection('review');
                              navigate('/review');
                            }}
                            className="p-1.5 text-blue-400 hover:text-white hover:bg-[#0d1117] rounded-lg transition-all"
                            title="Run AI Review"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              selectProject(proj);
                              navigate(`/projects/${proj.id}`);
                            }}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#0d1117] rounded-lg transition-all"
                            title="Open Settings"
                          >
                            <Settings className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, proj.id, proj.name)}
                            className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-[#0d1117] rounded-lg transition-all"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#30363d] flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {filteredProjects.length} of {projects.length} projects
            {selectedProjects.size > 0 && ` • ${selectedProjects.size} selected`}
          </span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};