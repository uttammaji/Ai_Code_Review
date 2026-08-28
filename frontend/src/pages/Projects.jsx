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
  AlertCircle,
  ShieldCheck,
  X
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const Projects = () => {
  const { projects, fetchProjects, deleteProject, selectProject } = useProjectStore();
  const { setActiveSection, addNotification } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects().finally(() => setLoading(false));
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.repository || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.language || '').toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      switch (selectedFilter) {
        case 'healthy':
          return (p.score || 85) >= 90;
        case 'warning':
          return (p.score || 85) < 90 && (p.score || 85) >= 75;
        case 'critical':
          return (p.score || 85) < 75;
        default:
          return true;
      }
    });

    switch (sortBy) {
      case 'score':
        filtered = filtered.sort((a, b) => (b.score || 85) - (a.score || 85));
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

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete project "${name}"?`)) {
      await deleteProject(id);
      addNotification({
        title: 'Project Deleted',
        message: `Successfully deleted "${name}"`,
        type: 'info'
      });
    }
  };

  const stats = useMemo(() => {
    const total = projects.length;
    const healthy = projects.filter((p) => (p.score || 85) >= 90).length;
    const warning = projects.filter((p) => (p.score || 85) < 90 && (p.score || 85) >= 75).length;
    const critical = projects.filter((p) => (p.score || 85) < 75).length;
    const avgScore = total > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.score || 85), 0) / total) : 0;
    return { total, healthy, warning, critical, avgScore };
  }, [projects]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-amber-400';
    return 'text-rose-400';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500/20 border-t-blue-500"></div>
          <p className="text-sm text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-8 space-y-6 bg-[#0d1117]">
      {/* Header */}
      <div className="relative overflow-hidden p-6 bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl shadow-xl">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <FolderGit2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Projects Explorer
                <Badge variant="info" size="sm" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {stats.total} repositories
                </Badge>
              </h1>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Manage your codebases, track quality trends, and trigger AI reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setActiveSection('github');
                navigate('/github');
              }}
            >
              <span>Add Repository</span>
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{stats.healthy}</div>
              <div className="text-[10px] text-gray-400 font-mono">Healthy (90%+)</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-400">{stats.warning}</div>
              <div className="text-[10px] text-gray-400 font-mono">Needs Review</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-400">{stats.critical}</div>
              <div className="text-[10px] text-gray-400 font-mono">Critical</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{stats.avgScore}%</div>
              <div className="text-[10px] text-gray-400 font-mono">Average Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="relative flex-1 lg:w-80 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects, repos, languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161b22] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          <div className="flex items-center gap-1 bg-[#161b22] border border-white/10 rounded-xl p-1">
            {['all', 'healthy', 'warning', 'critical'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'healthy' ? 'Healthy' : filter === 'warning' ? 'Needs Review' : 'Critical'}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#161b22] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="score">Highest Score</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-[#161b22]/70 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0a0e14] border-b border-white/10">
                <th className="p-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider">Project Name</th>
                <th className="p-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider">Repository</th>
                <th className="p-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider">Language</th>
                <th className="p-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider text-center">Score</th>
                <th className="p-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    No projects found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => (
                  <tr
                    key={proj.id}
                    onClick={() => {
                      selectProject(proj);
                      navigate(`/projects/${proj.id}`);
                    }}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <FolderGit2 className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="font-bold text-sm text-white">{proj.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-gray-500" />
                        {proj.repository || 'workspace'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="info" size="sm" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {proj.language}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-base font-bold font-mono ${getScoreColor(proj.score || 85)}`}>
                        {proj.score || 85}%
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            selectProject(proj);
                            setActiveSection('review');
                            navigate('/review');
                          }}
                          className="p-1.5 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all cursor-pointer"
                          title="Run AI Review"
                        >
                          <Code2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, proj.id, proj.name)}
                          className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-all cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;
