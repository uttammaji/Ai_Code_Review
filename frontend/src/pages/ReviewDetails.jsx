import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { historyApi } from '../api/history.api';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  Cpu,
  CheckCircle2,
  AlertCircle,
  FileCode,
  GitBranch,
  Calendar,
  Eye,
  Check,
  Copy
} from 'lucide-react';

export const ReviewDetails = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      historyApi
        .getHistoryById(id)
        .then((res) => setReview(res.historyItem || null))
        .catch(() => setReview(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleCopyId = () => {
    if (review) {
      navigator.clipboard.writeText(review.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const current = review || {
    id: id || 'rev-sample',
    projectName: 'Authentication Service',
    overallScore: 92,
    scores: { security: 95, performance: 88, maintainability: 90, readability: 94, bestPractices: 92 },
    summary: 'The codebase demonstrates strong adherence to asynchronous patterns. Minor SQL parameterization improvements recommended.',
    issues: [
      {
        id: 'iss-1',
        title: 'Use Parameterized Queries',
        severity: 'WARNING',
        file: 'src/controllers/auth.controller.js',
        line: 32,
        description: 'Dynamic interpolation in database queries can lead to SQL injection.',
        suggestedFix: 'Replace template literal with parameterized placeholders $1, $2.'
      }
    ],
    createdAt: new Date().toISOString()
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-8 space-y-6 bg-[#0d1117]">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/history')}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review History</span>
        </button>

        <button
          onClick={handleCopyId}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-[#161b22] px-3 py-1.5 rounded-xl border border-white/10"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied ID' : 'Copy Audit ID'}</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Audit Report: {current.projectName}
            </h1>
            <Badge variant="success" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              {current.overallScore}% Score
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Audited on {new Date(current.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-500 uppercase font-mono block">Overall Code Health</span>
          <span className="text-3xl font-extrabold font-mono text-emerald-400">{current.overallScore} / 100</span>
        </div>
      </div>

      {/* Executive Summary */}
      {current.summary && (
        <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Eye className="w-4 h-4" /> Executive Summary
          </span>
          <p className="text-xs text-gray-300 leading-relaxed">{current.summary}</p>
        </div>
      )}

      {/* Issues Breakdown */}
      <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-4">
        <h3 className="font-bold text-sm text-white">Detected Code Quality & Security Issues</h3>
        <div className="space-y-3">
          {current.issues.map((iss) => (
            <div key={iss.id} className="p-4 bg-[#0d1117] border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge severity={iss.severity}>{iss.severity}</Badge>
                  <span className="font-bold text-xs text-white">{iss.title}</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400">
                  {iss.file}:{iss.line}
                </span>
              </div>
              <p className="text-xs text-gray-400">{iss.description}</p>
              {iss.suggestedFix && (
                <div className="text-xs text-emerald-400 pt-1 border-t border-white/5">
                  <strong>Suggested Fix:</strong> {iss.suggestedFix}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
