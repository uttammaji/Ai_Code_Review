import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useUIStore } from '../store/uiStore';
import {
  FolderGit2,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  History,
  Settings,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Code2,
  Play,
  Folder,
  File
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProjectDetails = () => {
  const { id } = useParams();
  const { selectedProject, fetchProjectById } = useProjectStore();
  const { setActiveSection } = useUIStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchProjectById(id).finally(() => setIsLoading(false));
    }
  }, [id, fetchProjectById]);

  const fileStructure = useMemo(
    () => [
      {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'controllers',
            type: 'folder',
            children: [
              { name: 'auth.controller.js', type: 'file', size: '4.2KB', issues: 0 },
              { name: 'project.controller.js', type: 'file', size: '6.8KB', issues: 2 },
              { name: 'review.controller.js', type: 'file', size: '8.1KB', issues: 1 },
            ],
          },
          {
            name: 'services',
            type: 'folder',
            children: [
              { name: 'aiReview.service.js', type: 'file', size: '12.5KB', issues: 3 },
              { name: 'github.service.js', type: 'file', size: '5.3KB', issues: 0 },
            ],
          },
        ],
      },
      { name: 'package.json', type: 'file', size: '2.1KB', issues: 0 },
      { name: 'README.md', type: 'file', size: '3.4KB', issues: 0 },
    ],
    []
  );

  const reviewHistory = useMemo(
    () => [
      { id: 'rev-01', date: 'Today', score: 94, issues: { critical: 0, warning: 1, suggestion: 3 } },
      { id: 'rev-02', date: 'Yesterday', score: 88, issues: { critical: 1, warning: 2, suggestion: 4 } },
      { id: 'rev-03', date: '3 days ago', score: 82, issues: { critical: 1, warning: 4, suggestion: 5 } },
    ],
    []
  );

  const renderFileTree = (items, level = 0) => {
    return items.map((item, idx) => (
      <div key={idx} style={{ paddingLeft: `${level * 16}px` }}>
        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5">
            {item.type === 'folder' ? (
              <Folder className="w-4 h-4 text-blue-400" />
            ) : (
              <File className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-xs text-gray-200">{item.name}</span>
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
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Review in IDE</span>
            </button>
          )}
        </div>
        {item.type === 'folder' && item.children && renderFileTree(item.children, level + 1)}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500/20 border-t-blue-500"></div>
          <p className="text-xs text-gray-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  const proj = selectedProject || {
    name: 'AI-Code-Review',
    description: 'Autonomous Senior AI Staff Engineer Code Review System',
    repository: 'uttammaji/Ai_Code_Review',
    branch: 'main',
    language: 'JavaScript',
    score: 94,
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-8 space-y-6 bg-[#0d1117]">
      {/* Top navigation back button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>
      </div>

      {/* Project Banner Header */}
      <div className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl shadow-xl">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
              <FolderGit2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {proj.name}
                </h1>
                <Badge variant="success" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  {proj.score}% Score
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1 max-w-xl">
                {proj.description || 'Monitored code repository and review history'}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 font-mono">
                <span className="flex items-center gap-1 text-blue-400">
                  <GitBranch className="w-3.5 h-3.5" />
                  {proj.branch || 'main'}
                </span>
                <span>•</span>
                <span>{proj.language}</span>
                <span>•</span>
                <span>{proj.repository}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<Code2 className="w-4 h-4" />}
              onClick={() => {
                setActiveSection('review');
                navigate('/review');
              }}
              className="shadow-lg shadow-blue-500/20"
            >
              <span>Open in Review IDE</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        {['overview', 'files', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-4">
              <h3 className="font-bold text-sm text-white">Repository Health Overview</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Automated continuous review is enabled for branch <strong>{proj.branch || 'main'}</strong>. Codebase follows standard architectural heuristics and modern clean design patterns.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#0d1117] border border-white/10 rounded-2xl">
                  <span className="text-[10px] text-gray-500 block uppercase font-mono">Security</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">98%</span>
                </div>
                <div className="p-3 bg-[#0d1117] border border-white/10 rounded-2xl">
                  <span className="text-[10px] text-gray-500 block uppercase font-mono">Performance</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">88%</span>
                </div>
                <div className="p-3 bg-[#0d1117] border border-white/10 rounded-2xl">
                  <span className="text-[10px] text-gray-500 block uppercase font-mono">Quality</span>
                  <span className="text-lg font-bold text-blue-400 font-mono">94%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-3">
              <h3 className="font-bold text-sm text-white">Quick Review</h3>
              <p className="text-xs text-gray-400">Launch a comprehensive AI review on this repository's source files.</p>
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center mt-2"
                onClick={() => {
                  setActiveSection('review');
                  navigate('/review');
                }}
              >
                Launch Analysis
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-2">
          <h3 className="font-bold text-sm text-white mb-4">Workspace File Tree</h3>
          {renderFileTree(fileStructure)}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-3">
          <h3 className="font-bold text-sm text-white mb-4">Audit History</h3>
          <div className="divide-y divide-white/5">
            {reviewHistory.map((rev) => (
              <div key={rev.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-white block">Audit {rev.id}</span>
                  <span className="text-[10px] text-gray-500">{rev.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-400">{rev.score}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/history')}
                    className="text-xs"
                  >
                    View Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
