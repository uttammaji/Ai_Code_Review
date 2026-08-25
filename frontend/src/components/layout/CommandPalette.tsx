import React, { useEffect, useState } from 'react';
import { useUIStore, ActivitySection } from '../../store/uiStore';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { 
  Search, 
  LayoutDashboard, 
  FolderGit2, 
  Code2, 
  GitBranch, 
  History, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Command,
  Rocket,
  FolderPlus,
  Home,
  FileCode,
  Github,
  Clock,
  Activity,
  Sliders,
  UserMinus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommandPalette: React.FC<{ onNewProjectClick: () => void }> = ({ onNewProjectClick }) => {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveSection } = useUIStore();
  const { logout } = useAuthStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const commands = [
    {
      id: 'cmd-review',
      title: 'Run AI Code Review',
      category: 'Actions',
      icon: <Code2 className="w-4 h-4 text-blue-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        setActiveSection('review');
        navigate('/review');
      }
    },
    {
      id: 'cmd-new-proj',
      title: 'Create New Project',
      category: 'Projects',
      icon: <FolderPlus className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        onNewProjectClick();
      }
    },
    {
      id: 'nav-dash',
      title: 'Go to Dashboard',
      category: 'Navigation',
      icon: <Home className="w-4 h-4 text-purple-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        setActiveSection('dashboard');
        navigate('/dashboard');
      }
    },
    {
      id: 'nav-projects',
      title: 'Open Projects Explorer',
      category: 'Navigation',
      icon: <FolderGit2 className="w-4 h-4 text-blue-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        setActiveSection('projects');
        navigate('/projects');
      }
    },
    {
      id: 'nav-review',
      title: 'Open Code Review Workspace',
      category: 'Navigation',
      icon: <FileCode className="w-4 h-4 text-amber-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        setActiveSection('review');
        navigate('/review');
      }
    },
    {
      id: 'nav-github',
      title: 'Connect / Manage GitHub',
      category: 'Navigation',
      icon: <Github className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        setActiveSection('github');
        navigate('/github');
      }
    },
    {
      id: 'nav-history',
      title: 'View Review History',
      category: 'Navigation',
      icon: <Clock className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        setActiveSection('history');
        navigate('/history');
      }
    },
    {
      id: 'nav-analytics',
      title: 'Open Developer Analytics',
      category: 'Navigation',
      icon: <Activity className="w-4 h-4 text-rose-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        setActiveSection('analytics');
        navigate('/analytics');
      }
    },
    {
      id: 'nav-settings',
      title: 'Open System Settings',
      category: 'Settings',
      icon: <Sliders className="w-4 h-4 text-gray-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        setActiveSection('settings');
        navigate('/settings');
      }
    },
    {
      id: 'cmd-logout',
      title: 'Sign Out / Logout',
      category: 'Account',
      icon: <UserMinus className="w-4 h-4 text-red-400" />,
      action: () => {
        setCommandPaletteOpen(false);
        logout();
      }
    }
  ];

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 p-4"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div 
        className="w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-[#30363d] bg-[#0d1117]">
          <Search className="w-4 h-4 text-[#C5A059] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <span className="text-[10px] bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d] font-mono text-gray-400">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-1.5 custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#21262d] transition-colors duration-200 text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-[#0d1117] border border-[#30363d] group-hover:border-[#30363d]">
                    {cmd.icon}
                  </div>
                  <span className="text-xs text-gray-200 group-hover:text-white font-medium">
                    {cmd.title}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};