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
  Sparkles,
  Plus,
  GitBranch,
  History as HistoryIcon,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  Users,
  Star,
  Activity,
  ChevronRight,
  MessageSquare,
  GitPullRequest,
  Calendar,
  Award,
  Flame,
  Bell,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { projects, fetchProjects, selectProject } = useProjectStore();
  const { runReview } = useReviewStore();
  const { setActiveSection } = useUIStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('Good morning');

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    fetchProjects().finally(() => setIsLoading(false));
  }, [fetchProjects]);

  // Calculate derived stats
  const stats = useMemo(() => {
    const totalProjects = projects.length || 4;
    const avgScore = projects.length ? Math.round(projects.reduce((acc, p) => acc + p.score, 0) / projects.length) : 92;
    const criticalIssues = projects.reduce((acc, p) => acc + (p.criticalIssues || 0), 0);
    const fixedIssues = projects.reduce((acc, p) => acc + (p.fixedIssues || 0), 0);

    return { totalProjects, avgScore, criticalIssues, fixedIssues };
  }, [projects]);

  // Mock recent activity with more realistic data
  const recentActivity = useMemo(() => [
    { id: 1, type: 'review', project: 'AI-Code-Review', time: '12 mins ago', status: 'completed', issues: { critical: 0, warning: 1, suggestion: 2 } },
    { id: 2, type: 'review', project: 'E-Commerce Core API', time: '4 hours ago', status: 'completed', issues: { critical: 1, warning: 2, suggestion: 0 } },
    { id: 3, type: 'deploy', project: 'Authentication Service', time: '1 day ago', status: 'success', message: 'Deployed to production' },
    { id: 4, type: 'pr', project: 'Frontend Dashboard', time: '2 days ago', status: 'open', message: 'PR #42: Fix navigation bug' },
  ], []);

  // Quick stats for the header
  const quickStats = [
    { label: 'Projects', value: stats.totalProjects, icon: FolderGit2, color: 'blue' },
    { label: 'Reviews', value: '248', icon: Code2, color: 'purple' },
    { label: 'Critical', value: stats.criticalIssues, icon: AlertOctagon, color: 'red' },
    { label: 'Resolved', value: stats.fixedIssues, icon: CheckCircle2, color: 'emerald' },
    { label: 'Quality', value: `${stats.avgScore}%`, icon: TrendingUp, color: 'amber' },
  ];

  const quickActions = [
    { id: 'review', label: 'Review Code', description: 'Run AI Analysis', shortcut: 'Ctrl+R', icon: Sparkles, color: 'blue' },
    { id: 'github', label: 'Connect GitHub', description: 'Sync Repositories', shortcut: 'Ctrl+4', icon: GitBranch, color: 'emerald' },
    { id: 'history', label: 'View History', description: 'Past Audit Logs', shortcut: 'Ctrl+5', icon: HistoryIcon, color: 'purple' },
    { id: 'projects', label: 'Projects Explorer', description: 'Manage Repos', shortcut: 'Ctrl+2', icon: FolderGit2, color: 'amber' },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-[#161b22]">
      {/* Enhanced Welcome Banner */}
      <div className="relative overflow-hidden p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {greeting}, {user?.name || 'Developer'}
              </h1>
              <span className="animate-pulse text-xl">👋</span>
              <Badge variant="success" size="sm" className="ml-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
              Ready to ship quality code? Your codebase is looking great today.
              <span className="block text-xs text-gray-500 mt-1">
                <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-400" />
                100% vulnerability prevention rate • {stats.avgScore}% average quality score
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                setActiveSection('review');
                navigate('/review');
              }}
              className="group relative overflow-hidden"
            >
              <span className="relative z-10">Start Code Review</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <ChevronRight className="w-4 h-4 ml-1 relative z-10 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg transition-all text-gray-400 hover:text-white"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#161b22]"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats with micro-interactions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorMap = {
            blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
            purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
            red: 'from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-400',
            emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
            amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400',
          };

          return (
            <div
              key={stat.label}
              className="group p-4 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-xl hover:border-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-opacity-5 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${colorMap[stat.color]} border`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-white group-hover:text-blue-400 transition-colors">
                {stat.value}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block opacity-60 group-hover:opacity-100 transition-opacity">
                {stat.label === 'Critical' ? 'Requires attention' :
                  stat.label === 'Resolved' ? '92% resolution rate' :
                    stat.label === 'Quality' ? 'Healthy score' :
                      stat.label === 'Projects' ? 'Active codebases' :
                        '+18 this week'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Actions with hover effects */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const colorMap = {
            blue: 'bg-blue-950/50 border-blue-800/40 text-blue-400 group-hover:bg-blue-950/70',
            emerald: 'bg-emerald-950/50 border-emerald-800/40 text-emerald-400 group-hover:bg-emerald-950/70',
            purple: 'bg-purple-950/50 border-purple-800/40 text-purple-400 group-hover:bg-purple-950/70',
            amber: 'bg-amber-950/50 border-amber-800/40 text-amber-400 group-hover:bg-amber-950/70',
          };

          return (
            <button
              key={action.id}
              onClick={() => {
                setActiveSection(action.id as any);
                navigate(`/${action.id === 'review' ? 'review' : action.id}`);
              }}
              className="group relative p-4 bg-gradient-to-br from-[#161b22] to-[#1c2333] hover:from-[#1c2333] hover:to-[#21262d] border border-[#30363d] hover:border-[#30363d] rounded-xl text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-white/5 transition-all duration-500"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg border transition-all duration-300 ${colorMap[action.color]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-200 block group-hover:text-white transition-colors">
                      {action.label}
                    </span>
                    <span className="text-[10px] text-gray-400">{action.description}</span>
                  </div>
                </div>
                <kbd className="hidden sm:block text-[10px] font-mono text-gray-500 bg-[#0d1117] px-2 py-1 rounded border border-[#30363d] group-hover:bg-[#1c2333] transition-colors">
                  {action.shortcut}
                </kbd>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid with enhanced cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects with better visual hierarchy */}
        <div className="p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-xl hover:border-blue-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <FolderGit2 className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
                Recent Projects
              </h3>
            </div>
            <button
              onClick={() => {
                setActiveSection('projects');
                navigate('/projects');
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-2.5">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-[#0d1117] border border-[#30363d] rounded-lg animate-pulse">
                    <div className="h-4 bg-[#21262d] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[#21262d] rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    selectProject(proj);
                    navigate(`/projects/${proj.id}`);
                  }}
                  className="group p-3.5 bg-[#0d1117] hover:bg-[#1c2333] border border-[#30363d] hover:border-[#30363d] rounded-xl transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                          {proj.name}
                        </h4>
                        <Badge variant="info" size="sm" className="text-[9px] bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {proj.language}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          {proj.branch}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Updated 2d ago
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="text-lg font-bold font-mono text-blue-400 group-hover:text-blue-300 transition-colors">
                        {proj.score}%
                      </div>
                      <Badge variant={proj.status === 'Healthy' ? 'success' : 'warning'} size="sm">
                        {proj.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Timeline with enhanced design */}
        <div className="p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-xl hover:border-purple-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/10 rounded-lg">
                <HistoryIcon className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
                Recent Activity
              </h3>
            </div>
            <button
              onClick={() => {
                setActiveSection('history');
                navigate('/history');
              }}
              className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
            {recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                className="relative p-3.5 bg-[#0d1117] border border-[#30363d] rounded-xl hover:border-[#30363d] transition-all group"
              >
                {/* Timeline connector */}
                {index < recentActivity.length - 1 && (
                  <div className="absolute left-5 top-10 w-0.5 h-6 bg-[#30363d]"></div>
                )}

                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${activity.type === 'review' ? 'bg-blue-500/10 text-blue-400' :
                      activity.type === 'deploy' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-amber-500/10 text-amber-400'
                    }`}>
                    {activity.type === 'review' && <Code2 className="w-3.5 h-3.5" />}
                    {activity.type === 'deploy' && <ShieldCheck className="w-3.5 h-3.5" />}
                    {activity.type === 'pr' && <GitPullRequest className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-xs font-medium text-gray-200 truncate">
                        {activity.project}
                      </span>
                      <span className="text-[10px] text-gray-500 flex-shrink-0">
                        {activity.time}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mb-1.5">
                      {activity.type === 'review' && 'AI Code Review completed'}
                      {activity.type === 'deploy' && activity.message}
                      {activity.type === 'pr' && activity.message}
                    </p>

                    {activity.type === 'review' && activity.issues && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activity.issues.critical > 0 && (
                          <Badge variant="danger" size="sm" className="text-[9px] bg-rose-500/10 text-rose-400 border-rose-500/20">
                            {activity.issues.critical} Critical
                          </Badge>
                        )}
                        {activity.issues.warning > 0 && (
                          <Badge variant="warning" size="sm" className="text-[9px] bg-amber-500/10 text-amber-400 border-amber-500/20">
                            {activity.issues.warning} Warning
                          </Badge>
                        )}
                        {activity.issues.suggestion > 0 && (
                          <Badge variant="info" size="sm" className="text-[9px] bg-blue-500/10 text-blue-400 border-blue-500/20">
                            {activity.issues.suggestion} Suggestion
                          </Badge>
                        )}
                      </div>
                    )}

                    {activity.type === 'deploy' && (
                      <Badge variant="success" size="sm" className="text-[9px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        Successful
                      </Badge>
                    )}

                    {activity.type === 'pr' && (
                      <Badge variant="warning" size="sm" className="text-[9px] bg-amber-500/10 text-amber-400 border-amber-500/20">
                        Open
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with insights and quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 bg-[#161b22] border border-[#30363d] rounded-xl flex items-center gap-3 hover:border-emerald-500/20 transition-colors">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-200 block">Security Score</span>
            <span className="text-xs text-gray-400">100% • All vulnerabilities prevented</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#161b22] border border-[#30363d] rounded-xl flex items-center gap-3 hover:border-blue-500/20 transition-colors">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-200 block">Avg. Fix Time</span>
            <span className="text-xs text-gray-400">1.8 hours • 2x faster than industry avg</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#161b22] border border-[#30363d] rounded-xl flex items-center gap-3 hover:border-purple-500/20 transition-colors">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-200 block">Achievement Unlocked</span>
            <span className="text-xs text-gray-400">50+ reviews • Quality Champion 🏆</span>
          </div>
        </div>
      </div>
    </div>
  );
};