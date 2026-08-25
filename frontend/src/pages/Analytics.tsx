import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
  ComposedChart
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Clock,
  GitBranch,
  Users,
  Activity,
  ChevronRight,
  CheckCircle2,
  Eye,
  Code2,
  GitPullRequest,
  FileCode,
  Brain,
  Target,
  Award,
  Flame,
  Hash,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const qualityTrendData = useMemo(() => [
    { week: 'Week 1', score: 78, reviews: 12, commits: 45, coverage: 65 },
    { week: 'Week 2', score: 82, reviews: 18, commits: 52, coverage: 68 },
    { week: 'Week 3', score: 85, reviews: 24, commits: 48, coverage: 72 },
    { week: 'Week 4', score: 89, reviews: 31, commits: 63, coverage: 76 },
    { week: 'Week 5', score: 92, reviews: 42, commits: 58, coverage: 81 },
    { week: 'Week 6', score: 94, reviews: 38, commits: 71, coverage: 84 },
  ], []);

  const issueSeverityData = useMemo(() => [
    { category: 'Security', critical: 1, warning: 4, suggestion: 8, total: 13 },
    { category: 'Performance', critical: 0, warning: 6, suggestion: 12, total: 18 },
    { category: 'Maintainability', critical: 0, warning: 3, suggestion: 15, total: 18 },
    { category: 'Readability', critical: 0, warning: 1, suggestion: 9, total: 10 },
    { category: 'Dependencies', critical: 2, warning: 7, suggestion: 4, total: 13 },
  ], []);

  const teamVelocityData = useMemo(() => [
    { day: 'Mon', PRs: 8, reviews: 12, merges: 6 },
    { day: 'Tue', PRs: 12, reviews: 18, merges: 9 },
    { day: 'Wed', PRs: 10, reviews: 15, merges: 8 },
    { day: 'Thu', PRs: 15, reviews: 22, merges: 11 },
    { day: 'Fri', PRs: 7, reviews: 10, merges: 5 },
  ], []);

  const stats = useMemo(() => {
    const avgScore = Math.round(qualityTrendData.reduce((acc, d) => acc + d.score, 0) / qualityTrendData.length);
    const totalReviews = qualityTrendData.reduce((acc, d) => acc + d.reviews, 0);
    const totalCommits = qualityTrendData.reduce((acc, d) => acc + d.commits, 0);
    const improvement = qualityTrendData[qualityTrendData.length - 1].score - qualityTrendData[0].score;

    return { avgScore, totalReviews, totalCommits, improvement };
  }, [qualityTrendData]);

  const totalIssues = useMemo(() => {
    return issueSeverityData.reduce((acc, d) => acc + d.total, 0);
  }, [issueSeverityData]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[#0d1117]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
              <BarChart3 className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Developer Analytics
                <span className="ml-2 text-xs font-normal text-gray-400 bg-[#21262d] px-2 py-0.5 rounded-full">
                  Live
                </span>
              </h1>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                <span>Monitor codebase health, team velocity, and security metrics</span>
              </p>
            </div>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-[#21262d] p-1 rounded-lg border border-[#30363d]">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                timeRange === range
                  ? 'bg-[#30363d] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-[#2d333b]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="group p-4 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-blue-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Quality Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1.5">
            {stats.avgScore}%
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full font-medium">
              +{stats.improvement}%
            </span>
            <span className="text-[10px] text-gray-500">improvement</span>
          </div>
        </div>

        <div className="group p-4 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Code Reviews</span>
            <Users className="w-4 h-4 text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1.5">
            {stats.totalReviews}
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">Last 6 weeks</span>
        </div>

        <div className="group p-4 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Commits</span>
            <GitBranch className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1.5">
            {stats.totalCommits}
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">Total contributions</span>
        </div>

        <div className="group p-4 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-amber-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Issues Found</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1.5">
            {totalIssues}
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">Across all categories</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trend */}
        <div className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-blue-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <div className="p-1 bg-blue-500/10 rounded-md">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span>Quality Score Trend</span>
            </h3>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Score
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400/40 rounded-full"></span>
                Coverage
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={qualityTrendData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#30363d" strokeOpacity={0.5} />
                <XAxis dataKey="week" stroke="#6e7681" tick={{ fontSize: 10 }} axisLine={false} />
                <YAxis domain={[50, 100]} stroke="#6e7681" tick={{ fontSize: 10 }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1117',
                    borderColor: '#30363d',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}
                  labelStyle={{ color: '#8b949e' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#scoreGradient)"
                  dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#0d1117' }}
                />
                <Line
                  type="monotone"
                  dataKey="coverage"
                  stroke="#34d399"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ fill: '#34d399', r: 3, strokeWidth: 1.5, stroke: '#0d1117' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Issue Severity Distribution */}
        <div className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-amber-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <div className="p-1 bg-amber-500/10 rounded-md">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span>Issue Severity Breakdown</span>
            </h3>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-rose-400 rounded-full"></span>
                Critical
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                Warning
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Suggestion
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueSeverityData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" strokeOpacity={0.3} horizontal={false} />
                <XAxis type="number" stroke="#6e7681" tick={{ fontSize: 10 }} axisLine={false} />
                <YAxis type="category" dataKey="category" stroke="#6e7681" tick={{ fontSize: 11 }} axisLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1117',
                    borderColor: '#30363d',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}
                  labelStyle={{ color: '#8b949e' }}
                />
                <Bar dataKey="critical" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                <Bar dataKey="warning" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                <Bar dataKey="suggestion" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Velocity */}
        <div className="lg:col-span-2 p-5 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-purple-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <div className="p-1 bg-purple-500/10 rounded-md">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span>Team Velocity & Activity</span>
            </h3>
            <button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
              View details <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamVelocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" strokeOpacity={0.3} />
                <XAxis dataKey="day" stroke="#6e7681" tick={{ fontSize: 11 }} axisLine={false} />
                <YAxis stroke="#6e7681" tick={{ fontSize: 10 }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1117',
                    borderColor: '#30363d',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={6}
                  wrapperStyle={{ fontSize: '10px', color: '#8b949e' }}
                />
                <Bar dataKey="PRs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reviews" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="merges" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer insight */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-[#30363d] pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Security: All critical vulnerabilities resolved
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" />
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-1 text-rose-400/60">
          <Activity className="w-3 h-3" />
          <span>Powered by AI analysis</span>
        </div>
      </div>
    </div>
  );
};