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
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const qualityTrendData = useMemo(
    () => [
      { week: 'Week 1', score: 78, reviews: 12 },
      { week: 'Week 2', score: 82, reviews: 18 },
      { week: 'Week 3', score: 85, reviews: 24 },
      { week: 'Week 4', score: 89, reviews: 31 },
      { week: 'Week 5', score: 92, reviews: 42 },
      { week: 'Week 6', score: 94, reviews: 38 },
    ],
    []
  );

  const issueSeverityData = useMemo(
    () => [
      { category: 'Security', critical: 1, warning: 4, suggestion: 8 },
      { category: 'Performance', critical: 0, warning: 6, suggestion: 12 },
      { category: 'Maintainability', critical: 0, warning: 3, suggestion: 15 },
      { category: 'Readability', critical: 0, warning: 1, suggestion: 9 },
    ],
    []
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-8 space-y-6 bg-[#0d1117]">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Developer Quality Analytics
              </h1>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Live Heuristics
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Real-time insights across code health, security vulnerabilities, and team velocity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#161b22] p-1 rounded-2xl border border-white/10">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Score Trend */}
        <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Quality Score Trend
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400">+16% Improvement</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="week" stroke="#8b949e" tick={{ fontSize: 11 }} />
                <YAxis stroke="#8b949e" domain={[60, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="score" stroke="#58a6ff" strokeWidth={3} dot={{ fill: '#58a6ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Issue Distribution by Category */}
        <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Issue Distribution
            </h3>
            <span className="text-xs text-gray-400">By Severity</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueSeverityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="category" stroke="#8b949e" tick={{ fontSize: 11 }} />
                <YAxis stroke="#8b949e" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="critical" fill="#f85149" name="Critical" radius={[4, 4, 0, 0]} />
                <Bar dataKey="warning" fill="#d29922" name="Warning" radius={[4, 4, 0, 0]} />
                <Bar dataKey="suggestion" fill="#58a6ff" name="Suggestion" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
