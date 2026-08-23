import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  User,
  Mail,
  ShieldCheck,
  Key,
  Calendar,
  Clock,
  Activity,
  Edit,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Globe,
  Award,
  Star,
  Zap,
  Lock,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Copy,
  Check,
  Fingerprint,
  BadgeCheck,
  TrendingUp,
  Target
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const Profile: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [copied, setCopied] = useState(false);

  const userData = {
    id: user?.id || 'u_1092837',
    name: user?.name || 'Uttam Maji',
    email: user?.email || 'uttammaji842@gmail.com',
    avatar: user?.avatar || null,
    joined: 'January 2024',
    lastActive: '2 hours ago',
    totalReviews: '248',
    averageScore: '92%',
    issuesFound: '1,342',
    resolvedIssues: '1,234'
  };

  const stats = [
    { label: 'Total Reviews', value: userData.totalReviews, icon: Activity, color: 'blue' },
    { label: 'Avg. Score', value: userData.averageScore, icon: Star, color: 'emerald' },
    { label: 'Issues Found', value: userData.issuesFound, icon: AlertCircle, color: 'amber' },
    { label: 'Resolved', value: userData.resolvedIssues, icon: CheckCircle2, color: 'purple' },
  ];

  const recentActivity = [
    { action: 'Reviewed repository', project: 'AI-Code-Review', time: '2 hours ago', status: 'completed' },
    { action: 'Fixed critical issue', project: 'E-Commerce API', time: '5 hours ago', status: 'fixed' },
    { action: 'Submitted PR', project: 'Frontend Dashboard', time: '1 day ago', status: 'pending' },
    { action: 'Connected GitHub', project: 'github.com/org', time: '2 days ago', status: 'completed' },
  ];

  const handleCopyID = () => {
    navigator.clipboard.writeText(userData.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  const securityBadges = [
    { label: '2FA Enabled', icon: ShieldCheck, status: true },
    { label: 'Email Verified', icon: CheckCircle2, status: true },
    { label: 'Session Active', icon: Activity, status: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 bg-[#0d1117]">
      {/* Header */}
      <div className="relative overflow-hidden p-6 bg-[#161b22] border border-[#30363d] rounded-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Developer Profile
              </h1>
              <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Manage your account details and authentication credentials
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<Settings className="w-4 h-4" />}
            onClick={() => {/* Navigate to settings */}}
            className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]"
          >
            Account Settings
          </Button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl hover:border-opacity-50 transition-all">
            <div className="flex flex-col items-center text-center">
              {/* Avatar with online status */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white overflow-hidden ring-4 ring-[#30363d]">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                  ) : (
                    userData.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-[#161b22]"></div>
              </div>

              <div className="mt-4">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleSaveProfile}
                      className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); setEditedName(userData.name); }}
                      className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-400 font-mono flex items-center justify-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  {userData.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified Developer
                </Badge>
                <Badge variant="info" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <Zap className="w-3 h-3 mr-1" />
                  Pro Member
                </Badge>
              </div>

              <div className="w-full mt-4 pt-4 border-t border-[#30363d] space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">User ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-200 text-xs bg-[#0d1117] px-2 py-1 rounded border border-[#30363d]">
                      {userData.id}
                    </span>
                    <button
                      onClick={handleCopyID}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Copy ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Joined</span>
                  <span className="text-gray-200 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    {userData.joined}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Last Active</span>
                  <span className="text-gray-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    {userData.lastActive}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Authentication</span>
                  <span className="text-gray-200 flex items-center gap-1">
                    <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
                    Email OTP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="mt-4 p-4 bg-[#161b22] border border-[#30363d] rounded-2xl">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              Security Status
            </h3>
            <div className="space-y-2">
              {securityBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${badge.status ? 'text-emerald-400' : 'text-gray-500'}`} />
                      {badge.label}
                    </span>
                    <Badge variant={badge.status ? 'success' : 'warning'} size="sm">
                      {badge.status ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => logout()}
            className="mt-4 w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-sm text-rose-400 font-medium transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Right Column - Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              const colorMap = {
                blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
                emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
                amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400',
                purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400'
              };
              return (
                <div key={idx} className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-opacity-50 transition-all hover:-translate-y-0.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{stat.label}</span>
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${colorMap[stat.color as keyof typeof colorMap]} border`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl font-bold font-mono text-white">{stat.value}</div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <History className="w-3.5 h-3.5" />
                Recent Activity
              </h3>
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                View all
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, idx) => {
                const statusMap = {
                  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Completed' },
                  fixed: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Fixed' },
                  pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Pending' }
                };
                const status = statusMap[activity.status as keyof typeof statusMap] || statusMap.completed;

                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-xl hover:border-opacity-50 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-200">{activity.action}</span>
                        <Badge variant="info" size="sm" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px]">
                          {activity.project}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </span>
                    </div>
                    <Badge variant="info" size="sm" className={`${status.bg} ${status.color} border-none`}>
                      {status.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl flex items-center gap-3 hover:border-emerald-500/20 transition-all">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-200 block">Achievement</span>
                <span className="text-xs text-gray-400">Quality Champion</span>
              </div>
            </div>
            <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl flex items-center gap-3 hover:border-blue-500/20 transition-all">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-200 block">Contributions</span>
                <span className="text-xs text-gray-400">42 repositories</span>
              </div>
            </div>
            <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl flex items-center gap-3 hover:border-purple-500/20 transition-all">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-200 block">Success Rate</span>
                <span className="text-xs text-gray-400">92% resolution rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};