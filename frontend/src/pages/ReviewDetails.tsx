import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { historyApi } from '../api/history.api';
import { ReviewRecord } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  ArrowLeft,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  Zap,
  Cpu,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  FileCode,
  GitBranch,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Copy,
  Check,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

export const ReviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      historyApi.getHistoryById(id)
        .then(res => setReview(res.historyItem || null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const toggleIssueExpand = (issueId: string) => {
    const newSet = new Set(expandedIssues);
    if (newSet.has(issueId)) {
      newSet.delete(issueId);
    } else {
      newSet.add(issueId);
    }
    setExpandedIssues(newSet);
  };

  const handleCopyId = () => {
    if (review) {
      navigator.clipboard.writeText(review.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stats = useMemo(() => {
    if (!review) return null;
    const critical = review.issues.filter(i => i.severity === 'CRITICAL' || i.severity === 'ERROR').length;
    const warnings = review.issues.filter(i => i.severity === 'WARNING').length;
    const suggestions = review.issues.filter(i => i.severity === 'SUGGESTION' || i.severity === 'INFO').length;
    return { critical, warnings, suggestions, total: review.issues.length };
  }, [review]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 70) return 'text-amber-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-rose-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'bg-amber-500/10 border-amber-500/20';
    if (score >= 50) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
      case 'ERROR':
        return AlertCircle;
      case 'WARNING':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
      case 'ERROR':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'WARNING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500/20 border-t-blue-500"></div>
          <p className="text-sm text-gray-400">Loading review details...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="p-4 bg-[#161b22] rounded-full border border-[#30363d] inline-block">
            <AlertCircle className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-sm text-gray-400">Review not found</p>
          <button
            onClick={() => navigate('/history')}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to history
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-[#161b22]">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/history')}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#30363d] rounded-lg transition-all border border-[#30363d] bg-[#0d1117]"
              title="Back to history"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white font-mono">{review.id}</h1>
                <button
                  onClick={handleCopyId}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#30363d] rounded-lg transition-all"
                  title="Copy ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <Badge variant="info" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Review
                </Badge>
              </div>
              <p className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
                <FileCode className="w-3.5 h-3.5" />
                {review.projectName}
                <span className="w-px h-3 bg-[#30363d]" />
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className="w-px h-3 bg-[#30363d]" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(review.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="w-px h-3 bg-[#30363d]" />
                <Badge variant="info" size="sm" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {review.language}
                </Badge>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => alert('Downloading JSON Audit Report...')}
              className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]"
            >
              Download Report
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Share2 className="w-3.5 h-3.5" />}
              onClick={() => alert('Share link copied to clipboard')}
              className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]"
            >
              Share
            </Button>
          </div>
        </div>

        {/* Quick stats in header */}
        {stats && (
          <div className="relative mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#30363d]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-500/10 rounded-lg">
                <AlertCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-rose-400">{stats.critical}</div>
                <div className="text-[10px] text-gray-500">Critical</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-amber-400">{stats.warnings}</div>
                <div className="text-[10px] text-gray-500">Warnings</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <Info className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-blue-400">{stats.suggestions}</div>
                <div className="text-[10px] text-gray-500">Suggestions</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{stats.total}</div>
                <div className="text-[10px] text-gray-500">Total Issues</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={`p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border rounded-2xl text-center transition-all hover:border-opacity-50 hover:-translate-y-0.5 ${getScoreBg(review.overallScore)}`}>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Overall Score</span>
          <div className={`text-3xl font-bold font-mono mt-1.5 ${getScoreColor(review.overallScore)}`}>
            {review.overallScore}%
          </div>
          <div className="mt-1 text-[10px] text-gray-500">
            {review.overallScore >= 90 ? 'Excellent' :
              review.overallScore >= 70 ? 'Good' :
                review.overallScore >= 50 ? 'Needs Improvement' : 'Critical'}
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl text-center hover:border-emerald-500/20 transition-all hover:-translate-y-0.5">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Security
          </span>
          <div className={`text-2xl font-bold font-mono mt-1.5 ${getScoreColor(review.scores.security)}`}>
            {review.scores.security}%
          </div>
          <div className="mt-1 w-full h-1 bg-[#30363d] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${review.scores.security >= 90 ? 'bg-emerald-400' :
                  review.scores.security >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              style={{ width: `${review.scores.security}%` }}
            />
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl text-center hover:border-amber-500/20 transition-all hover:-translate-y-0.5">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Performance
          </span>
          <div className={`text-2xl font-bold font-mono mt-1.5 ${getScoreColor(review.scores.performance)}`}>
            {review.scores.performance}%
          </div>
          <div className="mt-1 w-full h-1 bg-[#30363d] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${review.scores.performance >= 90 ? 'bg-emerald-400' :
                  review.scores.performance >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              style={{ width: `${review.scores.performance}%` }}
            />
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl text-center hover:border-purple-500/20 transition-all hover:-translate-y-0.5">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" /> Maintainability
          </span>
          <div className={`text-2xl font-bold font-mono mt-1.5 ${getScoreColor(review.scores.maintainability)}`}>
            {review.scores.maintainability}%
          </div>
          <div className="mt-1 w-full h-1 bg-[#30363d] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${review.scores.maintainability >= 90 ? 'bg-emerald-400' :
                  review.scores.maintainability >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              style={{ width: `${review.scores.maintainability}%` }}
            />
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl text-center hover:border-cyan-500/20 transition-all hover:-translate-y-0.5">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center justify-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" /> Readability
          </span>
          <div className={`text-2xl font-bold font-mono mt-1.5 ${getScoreColor(review.scores.readability)}`}>
            {review.scores.readability}%
          </div>
          <div className="mt-1 w-full h-1 bg-[#30363d] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${review.scores.readability >= 90 ? 'bg-emerald-400' :
                  review.scores.readability >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              style={{ width: `${review.scores.readability}%` }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Issues List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Detected Issues ({review.issues.length})
          </h3>
          <span className="text-xs text-gray-500">
            {stats?.critical > 0 && `${stats.critical} critical, `}
            {stats?.warnings > 0 && `${stats.warnings} warnings, `}
            {stats?.suggestions > 0 && `${stats.suggestions} suggestions`}
          </span>
        </div>

        {review.issues.map((issue, index) => {
          const SeverityIcon = getSeverityIcon(issue.severity);
          const isExpanded = expandedIssues.has(issue.id || `issue-${index}`);

          return (
            <div
              key={issue.id || `issue-${index}`}
              className="group p-5 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl hover:border-opacity-50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <Badge severity={issue.severity} className={getSeverityColor(issue.severity)}>
                      <SeverityIcon className="w-3 h-3 mr-1" />
                      {issue.severity}
                    </Badge>
                    <span className="font-semibold text-white text-sm">{issue.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileCode className="w-3 h-3" />
                      {issue.file || 'Unknown file'}
                    </span>
                    {issue.line && (
                      <>
                        <span className="w-px h-3 bg-[#30363d]" />
                        <span>Line {issue.line}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleIssueExpand(issue.id || `issue-${index}`)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#0d1117] rounded-lg transition-all flex-shrink-0"
                >
                  {isExpanded ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-3 animate-slideDown">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {issue.description}
                  </p>

                  {issue.suggestedFix && (
                    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Suggested Fix
                        </span>
                      </div>
                      <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap break-words bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
                        {issue.suggestedFix}
                      </pre>
                    </div>
                  )}

                  {issue.codeSnippet && (
                    <div className="p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FileCode className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">Code Snippet</span>
                      </div>
                      <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-words">
                        {issue.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#30363d]">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Review completed
          </span>
          <span className="w-px h-3 bg-[#30363d]" />
          <span>Generated by AI Code Review v3.0</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<ExternalLink className="w-3.5 h-3.5" />}
            onClick={() => window.open(`/review`, '_blank')}
            className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]"
          >
            Open in Review
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={() => navigate('/review')}
          >
            Run New Review
          </Button>
        </div>
      </div>
    </div>
  );
};