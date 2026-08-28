import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Code2, 
  GitBranch, 
  History, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ActivityBar = () => {
  const { activeSection, setActiveSection } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { id: 'projects', label: 'Projects Explorer', icon: <FolderGit2 className="w-5 h-5" />, path: '/projects' },
    { id: 'review', label: 'Code Review IDE', icon: <Code2 className="w-5 h-5" />, path: '/review' },
    { id: 'github', label: 'GitHub Sync', icon: <GitBranch className="w-5 h-5" />, path: '/github' },
    { id: 'history', label: 'Review History', icon: <History className="w-5 h-5" />, path: '/history' },
    { id: 'analytics', label: 'Developer Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  ];

  const handleSelect = (item) => {
    setActiveSection(item.id);
    navigate(item.path);
  };

  const getInitials = (name) => {
    if (!name) return 'UM';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="w-12 md:w-14 bg-[#0a0e14] border-r border-white/10 flex flex-col items-center justify-between py-3 z-30 shrink-0 select-none">
      {/* Top logo & navigation */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* App Logo */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-2 p-1.5 rounded-xl hover:bg-white/5 transition-all group relative"
          title="AI Code Review"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            &gt;_
          </div>
        </button>

        {/* Navigation Items */}
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              title={item.label}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r" />
              )}
              {item.icon}
            </button>
          );
        })}
      </div>

      {/* Bottom controls: User Avatar, Logout */}
      <div className="flex flex-col items-center gap-2.5 w-full pt-2 border-t border-white/10">
        <button
          onClick={() => navigate('/profile')}
          title={user?.name || 'User Profile'}
          className="w-8 h-8 rounded-full bg-[#161b22] border border-white/10 flex items-center justify-center text-xs font-semibold text-gray-300 overflow-hidden hover:border-blue-400 transition-colors duration-200"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            getInitials(user?.name)
          )}
        </button>

        <button
          onClick={logout}
          title="Sign Out"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default ActivityBar;
