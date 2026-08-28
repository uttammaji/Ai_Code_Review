import React, { useEffect, useState, useMemo } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useReviewStore } from '../store/reviewStore';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Code2,
  AlertOctagon,
  CheckCircle2,
  GitBranch,
  History as HistoryIcon,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { projects, fetchProjects, selectProject } = useProjectStore();
  const { setActiveSection } = useUIStore();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    fetchProjects();
  }, [fetchProjects]);

  const stats = useMemo(() => {
    const totalProjects = projects.length || 3;
    const avgScore = projects.length
      ? Math.round(projects.reduce((acc, p) => acc + (p.score || 85), 0) / projects.length)
      : 92;
    const criticalIssues = 0;
    const fixedIssues = 24;

    return { totalProjects, avgScore, criticalIssues, fixedIssues };
  }, [projects]);

  const quickStats = [
    { label: 'Total Repos', value: stats.totalProjects, icon: FolderGit2, color: 'blue' },
    { label: 'Code Audits', value: '142', icon: Code2, color: 'purple' },
    { label: 'Avg Quality', value: `${stats.avgScore}%`, icon: TrendingUp, color: 'emerald' },
    { label: 'Security Score', value: '98%', icon: ShieldCheck, color: 'cyan' },
    { label: 'Latency', value: '1.8s', icon: Zap, color: 'amber' },
  ];

  const quickActions = [
    { id: 'review', label: 'Run AI Review', description: 'Analyze code in Monaco IDE', icon: Code2, path: '/review', color: 'from-blue-600 to-indigo-600' },
    { id: 'github', label: 'GitHub Repos', description: 'Sync and review GitHub branches', icon: GitBranch, path: '/github', color: 'from-emerald-600 to-teal-600' },
    { id: 'projects', label: 'Projects Explorer', description: 'Manage and inspect projects', icon: FolderGit2, path: '/projects', color: 'from-purple-600 to-pink-600' },
    { id: 'history', label: 'Audit History', description: 'Past review reports and logs', icon: HistoryIcon, path: '/history', color: 'from-amber-600 to-orange-600' },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-8 space-y-6 bg-[#0d1117]">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {greeting}, {user?.name || 'Developer'}
              </h1>
              <Badge variant="success" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <Activity className="w-3 h-3 mr-1" />
                AI Online
              </Badge>
            </div>
            <p className="text-sm text-gray-300 max-w-xl leading-relaxed">
              Your AI Code Review engine is connected. Review code snippets, track repository health, and apply instant diff fixes.
            </p>
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
              className="shadow-xl shadow-blue-500/25"
            >
              <span>Start Code Review</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-[#161b22]/70 border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400">{stat.label}</span>
                <div className="p-2 rounded-xl bg-white/5 text-blue-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white font-mono tracking-tight">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Tiles */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3.5 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => {
                  setActiveSection(action.id);
                  navigate(action.path);
                }}
                className="p-5 bg-[#161b22]/70 border border-white/10 hover:border-blue-500/40 rounded-2xl cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                  {action.label}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{action.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Projects List */}
      <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Active Projects & Repositories</h2>
            <p className="text-xs text-gray-400 mt-0.5">Projects monitored with automated code quality audits</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
            className="text-blue-400 hover:text-blue-300"
          >
            View All Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.slice(0, 6).map((project) => (
            <div
              key={project.id}
              onClick={() => {
                selectProject(project);
                navigate(`/projects/${project.id}`);
              }}
              className="p-4 bg-[#0d1117] border border-white/10 hover:border-blue-500/40 rounded-2xl cursor-pointer transition-all hover:bg-[#161b22]"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold text-sm text-white truncate">{project.name}</div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {project.score}%
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate mb-3">{project.description || 'Repository codebase'}</p>
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                <span>{project.language}</span>
                <span className="text-blue-400">{project.branch || 'main'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
