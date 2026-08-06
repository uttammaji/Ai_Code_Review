import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useUIStore } from '../store/uiStore';
import { useReviewStore } from '../store/reviewStore';
import {
  FolderGit2,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Cpu,
  Zap,
  CheckCircle2,
  History,
  Settings,
  FileCode,
  ArrowLeft,
  Star,
  GitFork,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Code2,
  BarChart3,
  TrendingUp,
  Users,
  Layers,
  ExternalLink,
  MoreVertical,
  ChevronDown,
  Download,
  Play,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedProject, fetchProjectById } = useProjectStore();
  const { setActiveSection } = useUIStore();
  const { runReview } = useReviewStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'history' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchProjectById(id).finally(() => setIsLoading(false));
    }
  }, [id, fetchProjectById]);

  // Mock file data with more realistic structure
  const fileStructure = useMemo(() => [
    {
      name: 'src', type: 'folder', children: [
        {
          name: 'controllers', type: 'folder', children: [
            { name: 'auth.controller.js', type: 'file', size: '4.2KB', lastModified: '2 hours ago', issues: 0 },
            { name: 'project.controller.js', type: 'file', size: '6.8KB', lastModified: '1 day ago', issues: 2 },
            { name: 'review.controller.js', type: 'file', size: '8.1KB', lastModified: '3 hours ago', issues: 1 },
          ]
        },
        {
          name: 'services', type: 'folder', children: [
            { name: 'aiReview.service.js', type: 'file', size: '12.5KB', lastModified: '5 hours ago', issues: 3 },
            { name: 'github.service.js', type: 'file', size: '5.3KB', lastModified: '2 days ago', issues: 0 },
          ]
        },
        {
          name: 'routes', type: 'folder', children: [
            { name: 'auth.routes.js', type: 'file', size: '3.1KB', lastModified: '4 hours ago', issues: 1 },
            { name: 'api.routes.js', type: 'file', size: '2.8KB', lastModified: '6 hours ago', issues: 0 },
          ]
        },
      ]
    },
    {
      name: 'tests', type: 'folder', children: [
        { name: 'auth.test.js', type: 'file', size: '7.2KB', lastModified: '1 day ago', issues: 0 },
        { name: 'project.test.js', type: 'file', size: '5.6KB', lastModified: '2 days ago', issues: 0 },
      ]
    },
    { name: 'package.json', type: 'file', size: '2.1KB', lastModified: '3 days ago', issues: 0 },
    { name: 'README.md', type: 'file', size: '3.4KB', lastModified: '5 days ago', issues: 0 },
  ], []);

  const reviewHistory = useMemo(() => [
    { id: 'rev-2024-001', date: '2024-01-15', score: 92, issues: { critical: 0, warning: 2, suggestion: 5 }, status: 'completed' },
    { id: 'rev-2024-002', date: '2024-01-12', score: 88, issues: { critical: 1, warning: 3, suggestion: 4 }, status: 'completed' },
    { id: 'rev-2024-003', date: '2024-01-10', score: 85, issues: { critical: 0, warning: 4, suggestion: 6 }, status: 'completed' },
    { id: 'rev-2024-004', date: '2024-01-08', score: 78, issues: { critical: 2, warning: 5, suggestion: 3 }, status: 'completed' },
  ], []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { label: 'A+', color: 'emerald' };
    if (score >= 80) return { label: 'A', color: 'blue' };
    if (score >= 70) return { label: 'B', color: 'amber' };
    if (score >= 60) return { label: 'C', color: 'rose' };
    return { label: 'D', color: 'rose' };
  };

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item, idx) => (
      <div key={idx} style={{ paddingLeft: `${level * 16}px` }}>
        <div className={`flex items-center justify-between p-2 hover:bg-[#21262d] rounded-lg transition-colors cursor-pointer group`}>
          <div className="flex items-center gap-2">
            {item.type === 'folder' ? (
              <FolderGit2 className="w-4 h-4 text-blue-400" />
            ) : (
              <FileCode className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-sm text-gray-200">{item.name}</span>
            {item.type === 'file' && (
              <>
                <span className="text-[10px] text-gray-500 font-mono">{item.size}</span>
                {item.issues > 0 && (
                  <Badge variant="warning" size="sm" className="text-[9px] bg-amber-500/10 text-amber-400 border-amber-500/20">
                    {item.issues} issues
                  </Badge>
                )}
              </>
            )}
          </div>
          {item.type === 'file' && (
            <button
              onClick={() => {
                setActiveSection('review');
                navigate('/review');
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              Review
            </button>
          )}
        </div>
        {item.type === 'folder' && item.children && (
          <div className="ml-2 border-l border-[#30363d] pl-2">
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500/20 border-t-blue-500"></div>
          <p className="text-sm text-gray-400">Loading project workspace...</p>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="p-4 bg-[#161b22] rounded-full border border-[#30363d] inline-block">
            <FolderGit2 className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-sm text-gray-400">Project not found</p>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to projects
          </button>
        </div>
      </div>
    );
  }

  const grade = getScoreGrade(selectedProject.score);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-[#161b22]">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#30363d] rounded-lg transition-all border border-[#30363d] bg-[#0d1117]"
              title="Back to projects"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white font-mono">{selectedProject.name}</h1>
                <Badge variant="info" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {selectedProject.language}
                </Badge>
                <Badge variant="info" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                  <GitBranch className="w-3 h-3 mr-1" />
                  {selectedProject.branch}
                </Badge>
              </div>
              <p className="text-sm text-gray-400 font-mono mt-0.5 flex items-center gap-2">
                {selectedProject.repository}
                <button className="text-gray-500 hover:text-gray-300 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                setActiveSection('review');
                navigate('/review');
              }}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">Run AI Review</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={() => fetchProjectById(id!)}
              className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="relative mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#30363d]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Passed</div>
              <div className="text-[10px] text-gray-500">Security Rating</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 rounded-lg">
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Excellent</div>
              <div className="text-[10px] text-gray-500">Maintainability</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Optimized</div>
              <div className="text-[10px] text-gray-500">Performance</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Active</div>
              <div className="text-[10px] text-gray-500">Last reviewed 2h ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#30363d] text-sm">
        {['overview', 'files', 'history', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2.5 font-medium transition-all relative ${activeTab === tab
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            <span className="capitalize">{tab}</span>
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Enhanced Quality Grades */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-xl hover:border-emerald-500/20 transition-all hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">Code Quality</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-bold font-mono ${getScoreColor(selectedProject.score)}`}>
                  {grade.label}
                </span>
                <span className="text-sm text-gray-400 font-mono">({selectedProject.score}%)</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">Score: {selectedProject.score}%</span>
            </div>

            <div className="group p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-xl hover:border-emerald-500/20 transition-all hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Security
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">✓ Passed</div>
              <span className="text-[10px] text-gray-500 mt-1 block">0 Critical CVEs</span>
            </div>

            <div className="group p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-xl hover:border-purple-500/20 transition-all hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" /> Maintainability
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-purple-400">Excellent</div>
              <span className="text-[10px] text-gray-500 mt-1 block">Low coupling</span>
            </div>

            <div className="group p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-xl hover:border-amber-500/20 transition-all hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Performance
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400">Optimized</div>
              <span className="text-[10px] text-gray-500 mt-1 block">Fast execution</span>
            </div>
          </div>

          {/* Enhanced Details Card */}
          <div className="p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-blue-400" />
              Repository Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                <span className="text-[10px] text-gray-500 block font-medium uppercase tracking-wider">Description</span>
                <span className="text-gray-200 font-mono">{selectedProject.description || 'No description provided'}</span>
              </div>
              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                <span className="text-[10px] text-gray-500 block font-medium uppercase tracking-wider">Default Branch</span>
                <span className="text-gray-200 font-mono">{selectedProject.branch}</span>
              </div>
              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                <span className="text-[10px] text-gray-500 block font-medium uppercase tracking-wider">Total Reviews</span>
                <span className="text-gray-200 font-mono">{selectedProject.reviewsCount || 0} audits</span>
              </div>
              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                <span className="text-[10px] text-gray-500 block font-medium uppercase tracking-wider">Last Reviewed</span>
                <span className="text-gray-200 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  {selectedProject.lastReviewed || 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Issue Distribution */}
          <div className="p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Issue Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Critical</span>
                  <span className="text-lg font-bold font-mono text-rose-400">0</span>
                </div>
                <div className="w-full h-1.5 bg-[#30363d] rounded-full mt-2 overflow-hidden">
                  <div className="w-0 h-full bg-rose-400 rounded-full"></div>
                </div>
              </div>
              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Warnings</span>
                  <span className="text-lg font-bold font-mono text-amber-400">2</span>
                </div>
                <div className="w-full h-1.5 bg-[#30363d] rounded-full mt-2 overflow-hidden">
                  <div className="w-2/5 h-full bg-amber-400 rounded-full"></div>
                </div>
              </div>
              <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Suggestions</span>
                  <span className="text-lg font-bold font-mono text-blue-400">5</span>
                </div>
                <div className="w-full h-1.5 bg-[#30363d] rounded-full mt-2 overflow-hidden">
                  <div className="w-full h-full bg-blue-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              Codebase Files
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">24 files</span>
              <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                Export
              </Button>
            </div>
          </div>
          <div className="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {renderFileTree(fileStructure)}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              Review History
            </h3>
            <span className="text-xs text-gray-500 font-mono">{reviewHistory.length} audits</span>
          </div>
          <div className="space-y-3">
            {reviewHistory.map((review, idx) => (
              <div key={idx} className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl hover:border-opacity-50 transition-all">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${review.score >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
                        review.score >= 80 ? 'bg-blue-500/10 text-blue-400' :
                          review.score >= 70 ? 'bg-amber-500/10 text-amber-400' :
                            'bg-rose-500/10 text-rose-400'
                      }`}>
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold text-white">{review.id}</span>
                        <Badge variant="success" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold font-mono ${getScoreColor(review.score)}`}>
                        {review.score}%
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                        <span className="text-rose-400">{review.issues.critical} C</span>
                        <span className="text-amber-400">{review.issues.warning} W</span>
                        <span className="text-blue-400">{review.issues.suggestion} S</span>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
          <div className="text-center py-8">
            <div className="inline-flex p-4 bg-[#0d1117] rounded-full border border-[#30363d] mb-4">
              <Settings className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Project Settings</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Configure project-specific settings, review rules, and integration preferences for {selectedProject.name}.
            </p>
            <div className="mt-4 space-y-2 max-w-sm mx-auto">
              <div className="flex items-center justify-between p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                <span className="text-sm text-gray-400">Auto-review on push</span>
                <Badge variant="success" size="sm">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                <span className="text-sm text-gray-400">Security scanning</span>
                <Badge variant="success" size="sm">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0d1117] rounded-xl border border-[#30363d]">
                <span className="text-sm text-gray-400">Performance analysis</span>
                <Badge variant="warning" size="sm">Disabled</Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};