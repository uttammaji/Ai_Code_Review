import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useProjectStore } from '../../store/projectStore';
import { useReviewStore } from '../../store/reviewStore';
import { useGitHubStore } from '../../store/githubStore';
import { 
  FolderGit2, 
  ChevronDown, 
  ChevronRight, 
  FileCode, 
  Plus, 
  Search, 
  Play, 
  GitBranch, 
  FolderPlus,
  Filter,
  Code2,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ onNewProjectClick }) => {
  const { activeSection, sidebarOpen } = useUIStore();
  const { projects, selectedProject, selectProject } = useProjectStore();
  const { openFiles, activeFile, openFile, runReview, reviewLoading } = useReviewStore();
  const { repositories, branches, selectedBranch, setSelectedBranch, selectedRepo, repositoryFiles, repositoryLoading, openRepositoryFile } = useGitHubStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [treeExpanded, setTreeExpanded] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const navigate = useNavigate();

  const toggleFolder = (path) => {
    setExpandedFolders((paths) => {
      const next = new Set(paths);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const renderRepositoryFiles = (items, depth = 0) =>
    items
      .filter((item) => item.type === 'folder' || item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((item) => {
        const isFolder = item.type === 'folder';
        const isExpanded = expandedFolders.has(item.path);
        const isActive = activeFile?.path === item.path;
        return (
          <React.Fragment key={item.path}>
            <button
              onClick={async () => {
                if (isFolder) return toggleFolder(item.path);
                try {
                  const f = await openRepositoryFile(item);
                  openFile(f);
                } catch {
                  // Ignore error
                }
              }}
              style={{ paddingLeft: `${8 + depth * 12}px` }}
              className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors duration-200 ${
                isActive ? 'bg-blue-500/10 text-blue-400 font-medium border-l-2 border-blue-500' : 'text-gray-400'
              }`}
            >
              {isFolder ? (
                isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-blue-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              ) : (
                <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              )}
              <span className="truncate">{item.name}</span>
            </button>
            {isFolder && isExpanded && item.children && renderRepositoryFiles(item.children, depth + 1)}
          </React.Fragment>
        );
      });

  if (!sidebarOpen) return null;

  return (
    <div className="w-60 md:w-64 bg-[#0d1117] border-r border-white/10 flex flex-col h-full shrink-0 select-none text-xs md:static absolute left-12 md:left-0 top-0 bottom-0 z-40 shadow-2xl">
      {/* Dynamic Content based on section */}
      {activeSection === 'dashboard' && (
        <div className="flex flex-col h-full">
          <div className="px-3 py-3 border-b border-white/10 flex items-center justify-between font-semibold text-gray-300 uppercase tracking-wider text-[11px]">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Sparkles className="w-3.5 h-3.5" /> COMMAND CENTER
            </span>
            <button 
              onClick={onNewProjectClick}
              className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
              title="New Project"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 flex flex-col gap-2 border-b border-white/10">
            <button 
              onClick={() => navigate('/review')}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-all duration-200 cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Run AI Review</span>
              <span className="ml-auto text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono">Ctrl+R</span>
            </button>

            <button 
              onClick={onNewProjectClick}
              className="w-full flex items-center gap-2 px-3 py-2 bg-[#161b22] hover:bg-[#1c2333] text-gray-200 rounded-xl font-medium border border-white/10 hover:border-blue-500/30 transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              <span>New Project</span>
              <span className="ml-auto text-[10px] text-gray-500 font-mono">Ctrl+N</span>
            </button>
          </div>

          <div className="p-2 flex-1 overflow-y-auto custom-scrollbar">
            <span className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Active Projects
            </span>
            <div className="flex flex-col gap-1">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    selectProject(p);
                    navigate(`/projects/${p.id}`);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all ${
                    selectedProject?.id === p.id ? 'bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/30' : 'text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderGit2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate text-xs">{p.name}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    p.score >= 90 ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/50' : 'bg-amber-950/60 text-amber-400 border border-amber-700/50'
                  }`}>
                    {p.score}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'review' && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-3 py-3 border-b border-white/10 flex items-center justify-between text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
            <span className="text-blue-400 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5" /> EXPLORER
            </span>
            <button
              onClick={() => setTreeExpanded(!treeExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {treeExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Filter */}
          <div className="px-2 py-2 border-b border-white/10">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search workspace files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#161b22] border border-white/10 rounded-lg pl-8 pr-2 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5">
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-gray-400 font-semibold cursor-pointer hover:text-white">
              <FolderGit2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">{selectedRepo?.name || 'Workspace'}</span>
            </div>

            <div className="flex flex-col gap-0.5 mt-1">
              {repositoryLoading ? (
                <p className="px-2 py-3 text-xs text-gray-500 animate-pulse">Loading repository files...</p>
              ) : repositoryFiles.length > 0 ? (
                renderRepositoryFiles(repositoryFiles)
              ) : (
                openFiles
                  .filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((file) => {
                    const isActive = activeFile?.path === file.path;
                    return (
                      <button
                        key={file.path}
                        onClick={() => openFile(file)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-white/5 transition-colors ${
                          isActive ? 'bg-blue-500/15 text-blue-400 font-medium border-l-2 border-blue-500' : 'text-gray-400'
                        }`}
                      >
                        <FileCode className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </button>
                    );
                  })
              )}
            </div>
          </div>

          {/* AI Trigger in Explorer */}
          <div className="p-3 border-t border-white/10 bg-[#0d1117]">
            <button
              onClick={() => {
                if (activeFile) {
                  runReview({
                    code: activeFile.content || '',
                    fileName: activeFile.name,
                    language: activeFile.language || 'JavaScript'
                  });
                }
              }}
              disabled={reviewLoading || !activeFile}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{reviewLoading ? 'Analyzing AST...' : 'Run AI Review'}</span>
            </button>
          </div>
        </div>
      )}

      {activeSection === 'projects' && (
        <div className="flex flex-col h-full">
          <div className="px-3 py-3 border-b border-white/10 flex items-center justify-between text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
            <span className="text-blue-400">PROJECTS</span>
            <button onClick={onNewProjectClick} className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-blue-400 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1.5">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  selectProject(p);
                  navigate(`/projects/${p.id}`);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedProject?.id === p.id 
                    ? 'bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-sm' 
                    : 'bg-[#161b22] border-white/5 text-gray-300 hover:border-blue-500/30'
                }`}
              >
                <div className="font-semibold truncate text-xs text-white">{p.name}</div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">{p.repository}</div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-mono">{p.language}</span>
                  <span className="text-emerald-400 font-mono font-medium">{p.score}% Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'github' && (
        <div className="flex flex-col h-full">
          <div className="px-3 py-3 border-b border-white/10 font-semibold text-gray-300 uppercase tracking-wider text-[11px]">
            <span className="text-blue-400">GITHUB BRANCHES</span>
          </div>
          <div className="p-3">
            <label className="text-[10px] text-gray-400 block mb-1">Active Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-[#161b22] border border-white/10 rounded-lg p-2 text-gray-200 text-xs focus:border-blue-500 focus:outline-none transition-colors"
            >
              {branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="p-2 flex-1 overflow-y-auto custom-scrollbar">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-2">Repositories</span>
            {repositories.map((r) => (
              <div key={r.id} className="p-2.5 border-b border-white/5 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                <div className="text-xs font-medium text-gray-200 truncate">{r.name}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{r.language} • ⭐ {r.stars}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'history' && (
        <div className="flex flex-col h-full">
          <div className="px-3 py-3 border-b border-white/10 font-semibold text-gray-300 uppercase tracking-wider text-[11px] flex items-center justify-between">
            <span className="text-blue-400">HISTORY FILTERS</span>
            <Filter className="w-4 h-4 text-blue-400" />
          </div>
          <div className="p-3 flex flex-col gap-3 text-gray-300">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs">
              <input type="checkbox" defaultChecked className="rounded border-white/20 bg-[#161b22] text-blue-500 accent-blue-500" />
              <span>Critical Security Alerts</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs">
              <input type="checkbox" defaultChecked className="rounded border-white/20 bg-[#161b22] text-blue-500 accent-blue-500" />
              <span>Performance Bottlenecks</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs">
              <input type="checkbox" defaultChecked className="rounded border-white/20 bg-[#161b22] text-blue-500 accent-blue-500" />
              <span>Maintainability Refactors</span>
            </label>
          </div>
        </div>
      )}

      {(activeSection === 'analytics' || activeSection === 'settings') && (
        <div className="p-4 text-gray-400 text-xs leading-relaxed">
          <div className="font-bold text-blue-400 uppercase tracking-wider text-[11px] mb-2">QUICK NAV</div>
          <p className="text-[11px] text-gray-400">Explore performance graphs, update Gemini AI models, or adjust security rules.</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
