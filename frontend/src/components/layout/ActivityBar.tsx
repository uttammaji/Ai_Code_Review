import React from 'react';
import { useUIStore, ActivitySection } from '../../store/uiStore';
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
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ActivityBar: React.FC = () => {
  const { activeSection, setActiveSection } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems: { id: ActivitySection; label: string; icon: React.ReactNode; path: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { id: 'projects', label: 'Projects Explorer', icon: <FolderGit2 className="w-5 h-5" />, path: '/projects' },
    { id: 'review', label: 'Code Review IDE', icon: <Code2 className="w-5 h-5" />, path: '/review' },
    { id: 'github', label: 'GitHub Sync', icon: <GitBranch className="w-5 h-5" />, path: '/github' },
    { id: 'history', label: 'Review History', icon: <History className="w-5 h-5" />, path: '/history' },
    { id: 'analytics', label: 'Developer Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  ];

  const handleSelect = (item: typeof navItems[0]) => {
    setActiveSection(item.id);
    navigate(item.path);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'UM';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="w-12 md:w-14 bg-[#0d1117] border-r border-[#30363d] flex flex-col items-center justify-between py-2.5 z-30 shrink-0 select-none">
      {/* Top logo & navigation */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {/* App Logo */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-3 p-1.5 rounded hover:bg-[#161b22] transition-colors group relative"
          title="AI Code Review"
        >
          <div className="w-7 h-7 rounded bg-gradient-to-br from-[#C5A059] to-[#8E6D2F] flex items-center justify-center text-[#0A0A0A] font-mono font-bold text-xs shadow-md shadow-[#C5A059]/10">
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
              className={`relative w-10 h-10 rounded flex items-center justify-center transition-colors duration-200 ${
                isActive 
                  ? 'text-[#C5A059] bg-[#161b22] border border-[#30363d]' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#161b22]'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#C5A059] rounded-r" />
              )}
              {item.icon}
            </button>
          );
        })}
      </div>

      {/* Bottom controls: User Avatar, Logout */}
      <div className="flex flex-col items-center gap-2 w-full pt-2 border-t border-[#30363d]">
        <button
          onClick={() => navigate('/profile')}
          title={user?.name || 'User Profile'}
          className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-xs font-semibold text-gray-300 overflow-hidden hover:border-[#C5A059] transition-colors duration-200"
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
          className="w-9 h-9 rounded flex items-center justify-center text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};