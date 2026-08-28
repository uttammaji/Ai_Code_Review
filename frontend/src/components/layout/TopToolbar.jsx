import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useProjectStore } from '../../store/projectStore';
import { useGitHubStore } from '../../store/githubStore';
import { useReviewStore } from '../../store/reviewStore';
import { useAuthStore } from '../../store/authStore';
import { 
  GitBranch, 
  Save, 
  Command, 
  PanelLeft, 
  PanelBottom, 
  Github, 
  Search,
  Check,
  User,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  Code2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopToolbar = ({ onNewProjectClick }) => {
  const { toggleSidebar, toggleBottomPanel, setCommandPaletteOpen } = useUIStore();
  const { selectedProject } = useProjectStore();
  const { connected, selectedBranch } = useGitHubStore();
  const { activeFile, runReview, reviewLoading } = useReviewStore();
  const { user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleRunReview = () => {
    if (activeFile) {
      runReview({
        code: activeFile.content || '',
        fileName: activeFile.name,
        language: activeFile.language || 'JavaScript'
      });
    } else {
      navigate('/review');
    }
  };

  return (
    <header className="h-11 bg-[#0a0e14] border-b border-white/10 px-4 flex items-center justify-between z-20 shrink-0 select-none text-xs">
      {/* Left side: Sidebar toggles & Workspace context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          title="Toggle Side Panel (Ctrl+B)"
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors shrink-0"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-white/10 shrink-0" />

        {/* Project & Branch Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-200 font-medium min-w-0 truncate">
          <span className="text-gray-300 font-mono truncate max-w-[120px] sm:max-w-none">
            {selectedProject ? selectedProject.name : 'AI-Code-Review'}
          </span>
          <span className="text-gray-600 hidden sm:inline">/</span>
          <div className="hidden sm:flex items-center gap-1.5 bg-[#161b22] px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-blue-400 shrink-0">
            <GitBranch className="w-3 h-3 text-blue-400" />
            <span className="font-mono">{selectedBranch || 'main'}</span>
          </div>
        </div>
      </div>

      {/* Middle: Command Palette Launcher */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden md:flex items-center gap-2 bg-[#161b22] hover:bg-[#1c2333] border border-white/10 text-gray-400 px-3 py-1.5 rounded-xl text-xs w-72 max-w-xs transition-colors"
      >
        <Search className="w-3.5 h-3.5 text-blue-400" />
        <span className="flex-1 text-left">Search commands or files...</span>
        <span className="flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded border border-white/10 text-[10px] font-mono text-gray-400">
          <Command className="w-2.5 h-2.5" /> K
        </span>
      </button>

      {/* Right side: Actions, Run Review, Status & User Menu */}
      <div className="flex items-center gap-2.5">
        {/* Run AI Review Primary Button */}
        <button
          onClick={handleRunReview}
          disabled={reviewLoading}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-3.5 py-1.5 rounded-xl shadow-md shadow-blue-500/20 transition-all text-xs cursor-pointer disabled:opacity-50"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{reviewLoading ? 'Reviewing...' : 'Run Review'}</span>
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          title="Save file (Ctrl+S)"
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors relative"
        >
          {savedSuccess ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={toggleBottomPanel}
          title="Toggle Bottom Terminal (Ctrl+J)"
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <PanelBottom className="w-4 h-4" />
        </button>

        {/* GitHub Indicator */}
        <div 
          onClick={() => navigate('/github')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer border transition-colors ${
            connected
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400 hover:bg-emerald-950/50'
              : 'bg-[#161b22] border-white/10 text-gray-400 hover:text-white'
          }`}
          title={connected ? 'GitHub Connected' : 'Connect GitHub'}
        >
          <Github className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono hidden lg:inline">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden shadow-sm">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0] || 'U'
              )}
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#161b22]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-1.5 z-50 animate-fade-in-up">
              <div className="px-4 py-2.5 border-b border-white/10">
                <p className="font-bold text-white text-xs">{user?.name || 'Developer'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email || 'developer@company.com'}</p>
              </div>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-blue-400" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <SettingsIcon className="w-4 h-4 text-purple-400" />
                <span>Settings</span>
              </button>
              <div className="border-t border-white/10 my-1" />
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopToolbar;
