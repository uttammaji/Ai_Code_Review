import React, { useEffect, useState, useMemo } from 'react';
import { historyApi } from '../api/history.api';
import { ReviewRecord, IssueSeverity, CodeIssue } from '../types';
import { Badge } from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  ExternalLink,
  Download,
  Filter,
  Clock,
  Calendar,
  X,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  GitBranch,
  Layers,
  RefreshCw
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';

// Dynamic type definitions
export type FilterOption = 'all' | 'critical' | 'warning' | 'clean';
export type SortOption = 'newest' | 'oldest' | 'score' | 'project' | 'language';

export interface HistoryStats {
  total: number;
  critical: number;
  warning: number;
  clean: number;
  avgScore: number;
  languages: string[];
  projects: string[];
}

export interface FilterState {
  search: string;
  filter: FilterOption;
  sort: SortOption;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  languages?: string[];
  projects?: string[];
}

export const History: React.FC = () => {
  const [historyList, setHistoryList] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    filter: 'all',
    sort: 'newest'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { addNotification } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await historyApi.getReviewHistory();
      setHistoryList(res.history || []);
    } catch {
      setHistoryList(getMockHistoryData());
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator for fallback
  const getMockHistoryData = (): ReviewRecord[] => {
    const projects = ['AI-Code-Review', 'E-Commerce API', 'Frontend Dashboard', 'Authentication Service', 'Data Pipeline'];
    const languages = ['TypeScript', 'Python', 'JavaScript', 'Go', 'Java', 'Rust'];
    const severities: IssueSeverity[] = ['CRITICAL', 'ERROR', 'WARNING', 'SUGGESTION', 'INFO'];
    
    return Array.from({ length: 25 }, (_, i) => {
      const numIssues = Math.floor(Math.random() * 5);
      const issues: CodeIssue[] = Array.from({ length: numIssues }, () => ({
        id: `issue-${Math.random().toString(36).substring(7)}`,
        severity: severities[Math.floor(Math.random() * severities.length)],
        title: `Issue ${Math.random().toString(36).substring(7)}`,
        description: `Description for issue ${i + 1}`,
        message: `Issue ${Math.random().toString(36).substring(7)}`,
        line: Math.floor(Math.random() * 100) + 1,
        file: `src/${['index', 'utils', 'helpers', 'components', 'services'][Math.floor(Math.random() * 5)]}.${['ts', 'js', 'py', 'go'][Math.floor(Math.random() * 4)]}`,
        whyItMatters: 'This issue affects code quality and security',
        suggestedFix: 'Refactor the code to follow best practices'
      }));

      return {
        id: `rev-2024-${String(i + 1).padStart(3, '0')}`,
        projectName: projects[Math.floor(Math.random() * projects.length)],
        repository: `github.com/org/${projects[Math.floor(Math.random() * projects.length)].toLowerCase().replace(/\s/g, '-')}`,
        language: languages[Math.floor(Math.random() * languages.length)],
        issues,
        overallScore: Math.floor(Math.random() * 40) + 55,
        createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
        branch: `feature/${['auth', 'payment', 'dashboard', 'api', 'optimization'][Math.floor(Math.random() * 5)]}`,
        commitHash: Math.random().toString(36).substring(2, 8),
        scores: {
          security: Math.floor(Math.random() * 30) + 70,
          performance: Math.floor(Math.random() * 30) + 70,
          maintainability: Math.floor(Math.random() * 30) + 70,
          readability: Math.floor(Math.random() * 30) + 70,
          bestPractices: Math.floor(Math.random() * 30) + 70
        },
        filesReviewedCount: Math.floor(Math.random() * 10) + 1,
        status: 'Completed'
      };
    });
  };

  // Dynamic filter and sort logic
  const filteredHistory = useMemo(() => {
    let filtered = [...historyList];

    if (filterState.search) {
      const searchLower = filterState.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.id.toLowerCase().includes(searchLower) ||
        item.projectName.toLowerCase().includes(searchLower) ||
        item.language.toLowerCase().includes(searchLower) ||
        (item.repository || '').toLowerCase().includes(searchLower) ||
        (item.branch || '').toLowerCase().includes(searchLower)
      );
    }

    if (filterState.filter !== 'all') {
      filtered = filtered.filter(item => {
        const criticals = item.issues.filter(i => i.severity === 'CRITICAL' || i.severity === 'ERROR');
        const warnings = item.issues.filter(i => i.severity === 'WARNING');
        const hasIssues = criticals.length > 0 || warnings.length > 0;

        switch (filterState.filter) {
          case 'critical': return criticals.length > 0;
          case 'warning': return warnings.length > 0 && criticals.length === 0;
          case 'clean': return !hasIssues;
          default: return true;
        }
      });
    }

    if (filterState.languages && filterState.languages.length > 0) {
      filtered = filtered.filter(item => 
        filterState.languages!.includes(item.language)
      );
    }

    if (filterState.projects && filterState.projects.length > 0) {
      filtered = filtered.filter(item => 
        filterState.projects!.includes(item.projectName)
      );
    }

    if (filterState.dateRange?.start) {
      filtered = filtered.filter(item => 
        new Date(item.createdAt) >= filterState.dateRange!.start!
      );
    }
    if (filterState.dateRange?.end) {
      filtered = filtered.filter(item => 
        new Date(item.createdAt) <= filterState.dateRange!.end!
      );
    }

    switch (filterState.sort) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'score':
        filtered.sort((a, b) => b.overallScore - a.overallScore);
        break;
      case 'project':
        filtered.sort((a, b) => a.projectName.localeCompare(b.projectName));
        break;
      case 'language':
        filtered.sort((a, b) => a.language.localeCompare(b.language));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [historyList, filterState]);

  const stats = useMemo<HistoryStats>(() => {
    const total = historyList.length;
    const critical = historyList.filter(item =>
      item.issues.some(i => i.severity === 'CRITICAL' || i.severity === 'ERROR')
    ).length;
    const warning = historyList.filter(item =>
      item.issues.some(i => i.severity === 'WARNING') &&
      !item.issues.some(i => i.severity === 'CRITICAL' || i.severity === 'ERROR')
    ).length;
    const clean = historyList.filter(item =>
      !item.issues.some(i => i.severity === 'CRITICAL' || i.severity === 'ERROR' || i.severity === 'WARNING')
    ).length;
    const avgScore = total > 0 ? Math.round(historyList.reduce((acc, i) => acc + i.overallScore, 0) / total) : 0;
    
    const languages = Array.from(new Set(historyList.map(item => item.language))).sort();
    const projects = Array.from(new Set(historyList.map(item => item.projectName))).sort();

    return { total, critical, warning, clean, avgScore, languages, projects };
  }, [historyList]);

  const filterOptions = useMemo(() => {
    const options: Record<FilterOption, { label: string; count: number; icon: React.ReactNode | null }> = {
      all: { label: 'All', count: stats.total, icon: null },
      critical: { label: 'Critical', count: stats.critical, icon: <AlertCircle className="w-3 h-3 text-rose-400" /> },
      warning: { label: 'Warnings', count: stats.warning, icon: null },
      clean: { label: 'Clean', count: stats.clean, icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" /> }
    };
    return options;
  }, [stats]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this review record?')) {
      try {
        await historyApi.deleteHistory(id);
        setHistoryList(prev => prev.filter(item => item.id !== id));
        addNotification({ title: 'History', message: 'Record deleted successfully', type: 'info' });
      } catch {
        addNotification({ title: 'Error', message: 'Failed to delete record', type: 'error' });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (window.confirm(`Delete ${selectedItems.size} review records?`)) {
      try {
        await Promise.all(Array.from(selectedItems).map(id => historyApi.deleteHistory(id as string)));
        setHistoryList(prev => prev.filter(item => !selectedItems.has(item.id)));
        setSelectedItems(new Set());
        addNotification({ title: 'History', message: `${selectedItems.size} records deleted`, type: 'info' });
      } catch {
        addNotification({ title: 'Error', message: 'Failed to delete records', type: 'error' });
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredHistory.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredHistory.map(item => item.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedItems(newSet);
  };

  const clearFilters = () => {
    setFilterState({
      search: '',
      filter: 'all',
      sort: 'newest',
      dateRange: undefined,
      languages: undefined,
      projects: undefined
    });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBadge = (score: number): { variant: 'success' | 'warning' | 'danger'; label: string } => {
    if (score >= 90) return { variant: 'success', label: 'Excellent' };
    if (score >= 70) return { variant: 'warning', label: 'Good' };
    return { variant: 'danger', label: 'Needs Work' };
  };

  const hasActiveFilters = filterState.search !== '' || 
    filterState.filter !== 'all' || 
    filterState.sort !== 'newest' ||
    (filterState.languages && filterState.languages.length > 0) ||
    (filterState.projects && filterState.projects.length > 0) ||
    filterState.dateRange?.start ||
    filterState.dateRange?.end;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 bg-[#0d1117]">
      {/* Header */}
      <div className="relative overflow-hidden p-6 bg-[#161b22] border border-[#30363d] rounded-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <HistoryIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Review History
                <Badge variant="info" size="sm" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                  {stats.total} records
                </Badge>
              </h1>
              <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>Historical audit logs from AI-powered code reviews</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadHistory}
              className="p-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg transition-all text-gray-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {}}
              className="p-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg transition-all text-gray-400 hover:text-white"
              title="Export"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Stats */}
        <div className="relative mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-[#30363d]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{stats.avgScore}%</div>
              <div className="text-[10px] text-gray-500">Average Score</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-400">{stats.critical}</div>
              <div className="text-[10px] text-gray-500">Critical Issues</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-400">{stats.warning}</div>
              <div className="text-[10px] text-gray-500">Warnings</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-400">{stats.clean}</div>
              <div className="text-[10px] text-gray-500">Clean Reviews</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 rounded-lg">
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{stats.total}</div>
              <div className="text-[10px] text-gray-500">Total Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search by ID, project, language..."
                value={filterState.search}
                onChange={(e) => setFilterState(prev => ({ ...prev, search: e.target.value }))}
                className="w-full bg-[#161b22] border border-[#30363d] rounded-xl pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              {filterState.search && (
                <button
                  onClick={() => setFilterState(prev => ({ ...prev, search: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2 rounded-xl border transition-all ${showAdvancedFilters ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-[#161b22] border-[#30363d] text-gray-400 hover:text-white'}`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <div className="flex items-center gap-1 bg-[#161b22] border border-[#30363d] rounded-lg p-1">
              {Object.entries(filterOptions).map(([key, option]) => {
                const optionData = option as { label: string; count: number; icon: React.ReactNode | null };
                return (
                  <button
                    key={key}
                    onClick={() => setFilterState(prev => ({ ...prev, filter: key as FilterOption }))}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                      filterState.filter === key
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
                    }`}
                  >
                    {optionData.icon}
                    {optionData.label}
                    <span className={`text-[9px] ${filterState.filter === key ? 'text-purple-200' : 'text-gray-500'}`}>
                      ({optionData.count})
                    </span>
                  </button>
                );
              })}
            </div>

            <select
              value={filterState.sort}
              onChange={(e) => setFilterState(prev => ({ ...prev, sort: e.target.value as SortOption }))}
              className="bg-[#161b22] border border-[#30363d] rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-purple-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="score">Highest Score</option>
              <option value="project">Project Name</option>
              <option value="language">Language</option>
            </select>

            {hasActiveFilters && (
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

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1.5">Languages</label>
              <div className="flex flex-wrap gap-1">
                {stats.languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      const current = filterState.languages || [];
                      const newLangs = current.includes(lang)
                        ? current.filter(l => l !== lang)
                        : [...current, lang];
                      setFilterState(prev => ({ ...prev, languages: newLangs.length > 0 ? newLangs : undefined }));
                    }}
                    className={`px-2 py-0.5 rounded-md text-xs border transition-all ${
                      (filterState.languages || []).includes(lang)
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-[#0d1117] text-gray-400 border-[#30363d] hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1.5">Projects</label>
              <div className="flex flex-wrap gap-1">
                {stats.projects.slice(0, 8).map(project => (
                  <button
                    key={project}
                    onClick={() => {
                      const current = filterState.projects || [];
                      const newProjects = current.includes(project)
                        ? current.filter(p => p !== project)
                        : [...current, project];
                      setFilterState(prev => ({ ...prev, projects: newProjects.length > 0 ? newProjects : undefined }));
                    }}
                    className={`px-2 py-0.5 rounded-md text-xs border transition-all ${
                      (filterState.projects || []).includes(project)
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-[#0d1117] text-gray-400 border-[#30363d] hover:text-white'
                    }`}
                  >
                    {project}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1.5">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filterState.dateRange?.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setFilterState(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: date }
                    }));
                  }}
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="date"
                  value={filterState.dateRange?.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setFilterState(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: date }
                    }));
                  }}
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk actions bar */}
      {selectedItems.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-[#161b22] border border-[#30363d] rounded-xl">
          <span className="text-sm text-gray-300">
            <span className="font-bold text-white">{selectedItems.size}</span> items selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedItems(new Set())}
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

      {/* History Table */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500/20 border-t-purple-500"></div>
            <p className="text-sm text-gray-400 mt-3">Loading history...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#0d1117] border-b border-[#30363d]">
                    <th className="p-4 w-8">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === filteredHistory.length && filteredHistory.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-[#30363d] bg-[#0d1117] text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                      />
                    </th>
                    <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">Review ID</th>
                    <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">Project</th>
                    <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">Language</th>
                    <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">Issues</th>
                    <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">Score</th>
                    <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs text-gray-400 font-semibold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]/40">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-[#0d1117] rounded-full border border-[#30363d]">
                            <Search className="w-8 h-8 text-gray-500" />
                          </div>
                          <p className="text-gray-400">No review records found</p>
                          <p className="text-xs text-gray-500">Try adjusting your filters or search terms</p>
                          <button
                            onClick={clearFilters}
                            className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item) => {
                      const criticals = item.issues.filter(i => i.severity === 'CRITICAL' || i.severity === 'ERROR');
                      const warnings = item.issues.filter(i => i.severity === 'WARNING');
                      const hasIssues = criticals.length > 0 || warnings.length > 0;
                      const scoreColor = getScoreColor(item.overallScore);
                      const scoreBadge = getScoreBadge(item.overallScore);

                      return (
                        <tr
                          key={item.id}
                          onClick={() => navigate(`/history/${item.id}`)}
                          className="hover:bg-[#21262d] transition-colors cursor-pointer group"
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => toggleSelect(item.id)}
                              className="rounded border-[#30363d] bg-[#0d1117] text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                            />
                          </td>
                          <td className="p-4 font-mono font-semibold text-purple-400 text-xs">
                            <span className="bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
                              {item.id}
                            </span>
                          </td>
                          <td className="p-4">
                            <div>
                              <span className="font-semibold text-gray-200">{item.projectName}</span>
                              {item.branch && (
                                <span className="text-xs text-gray-500 font-mono block mt-0.5">
                                  <GitBranch className="w-3 h-3 inline mr-1" />
                                  {item.branch}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="info" size="sm" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                              {item.language}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {criticals.length > 0 && (
                                <Badge variant="danger" size="sm" className="bg-rose-500/10 text-rose-400 border-rose-500/20">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  {criticals.length}
                                </Badge>
                              )}
                              {warnings.length > 0 && (
                                <Badge variant="warning" size="sm" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                                  {warnings.length}
                                </Badge>
                              )}
                              {!hasIssues && (
                                <Badge variant="success" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Clean
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div>
                              <div className={`text-lg font-bold font-mono ${scoreColor}`}>
                                {item.overallScore}%
                              </div>
                              <Badge
                                variant={scoreBadge.variant}
                                size="sm"
                                className={`mt-0.5 ${
                                  scoreBadge.variant === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  scoreBadge.variant === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}
                              >
                                {scoreBadge.label}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="text-[10px] font-mono mt-0.5">
                                {new Date(item.createdAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/history/${item.id}`);
                                }}
                                className="p-1.5 text-gray-500 hover:text-blue-400 rounded hover:bg-[#0d1117] transition-all"
                                title="View Details"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, item.id)}
                                className="p-1.5 text-gray-500 hover:text-rose-400 rounded hover:bg-[#0d1117] transition-all"
                                title="Delete Record"
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
                Showing {filteredHistory.length} of {historyList.length} records
                {selectedItems.size > 0 && ` • ${selectedItems.size} selected`}
              </span>
              <span className="flex items-center gap-2">
                <span>Items per page: 50</span>
                <span className="w-px h-4 bg-[#30363d]"></span>
                <span>Page 1 of 1</span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};