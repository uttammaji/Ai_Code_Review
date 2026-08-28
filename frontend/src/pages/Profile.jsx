import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Star,
  LogOut,
  Save,
  Check,
  Copy,
  FolderGit2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const Profile = () => {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Developer');
  const [copied, setCopied] = useState(false);

  const stats = [
    { label: 'Audits Run', value: '48', icon: Activity, color: 'blue' },
    { label: 'Avg. Score', value: '92%', icon: Star, color: 'emerald' },
    { label: 'Issues Found', value: '142', icon: AlertCircle, color: 'amber' },
    { label: 'Auto-Fixed Diffs', value: '89', icon: CheckCircle2, color: 'purple' },
  ];

  const handleCopyId = () => {
    navigator.clipboard.writeText(user?.id || 'usr_dev_1');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-8 space-y-6 bg-[#0d1117]">
      {/* Profile Header */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xl font-extrabold text-white shadow-xl shadow-blue-500/20">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-3xl" />
            ) : (
              (user?.name || 'D')[0]
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {user?.name || 'Developer'}
              </h1>
              <Badge variant="success" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Verified
              </Badge>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 font-mono">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              {user?.email || 'developer@company.com'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyId}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 bg-[#161b22] px-3.5 py-2 rounded-xl border border-white/10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied ID' : 'Copy Dev ID'}</span>
          </button>

          <Button
            variant="danger"
            size="sm"
            icon={<LogOut className="w-4 h-4" />}
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-5 bg-[#161b22]/70 border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">{stat.label}</span>
                <div className="p-2 rounded-xl bg-white/5 text-blue-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Account Details & Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-4">
          <h3 className="font-bold text-sm text-white">Account Details</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl p-2.5 text-gray-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Email Address</label>
              <input
                type="email"
                readOnly
                value={user?.email || 'developer@company.com'}
                className="w-full bg-[#0d1117]/60 border border-white/10 rounded-xl p-2.5 text-gray-400 text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-4">
          <h3 className="font-bold text-sm text-white">Security & Access Tokens</h3>
          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-white/10 rounded-2xl">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Session Encryption
              </span>
              <span className="text-emerald-400 font-mono font-bold">256-bit TLS</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-white/10 rounded-2xl">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> OTP Authentication
              </span>
              <span className="text-blue-400 font-mono font-bold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
