import React, { useState } from 'react';
import { useReviewStore } from '../../store/reviewStore';
import { IssueCard } from './IssueCard';
import { Sparkles, ShieldAlert, Zap, Cpu, Eye, ListChecks, Wand2, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const AIReviewPanel = () => {
  const { currentReview, reviewLoading, reviewStep, previewImprovedCode, activeFile } = useReviewStore();
  const [severityFilter, setSeverityFilter] = useState('ALL');

  if (reviewLoading) {
    return (
      <div className="w-full lg:w-80 xl:w-96 bg-[#0d1117] border-l border-white/10 flex flex-col p-5 shrink-0 font-mono text-xs animate-fade-in">
        <div className="flex items-center gap-2.5 text-blue-400 font-bold mb-4">
          <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
          <span>AI CODE ANALYSIS RUNNING</span>
        </div>

        {/* Terminal Animation Display */}
        <div className="bg-[#0a0e14] border border-blue-500/30 p-4 rounded-2xl flex-1 font-mono text-[11px] text-gray-300 flex flex-col justify-between shadow-xl shadow-blue-500/5">
          <div className="space-y-3">
            <p className="text-blue-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              $ ai-review analyze --deep
            </p>
            <p className="text-gray-300 bg-white/5 p-2.5 rounded-xl border border-white/5">{reviewStep}</p>
            <div className="w-full bg-[#161b22] rounded-full h-2 overflow-hidden mt-4 border border-white/10">
              <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full animate-pulse w-4/5 rounded-full" />
            </div>
          </div>

          <div className="text-gray-500 text-[10px] space-y-1.5 border-t border-white/10 pt-4">
            <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> AST syntax tree parsing</p>
            <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> OWASP vulnerability heuristics</p>
            <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Gemini Flash LLM review</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentReview) {
    return (
      <div className="w-full lg:w-80 xl:w-96 bg-[#0d1117] border-l border-white/10 flex flex-col items-center justify-center p-6 text-center shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
          <Sparkles className="w-7 h-7 animate-pulse" />
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight">AI Code Review Panel</h3>
        <p className="text-xs text-gray-400 mt-2 max-w-xs leading-relaxed">
          Open a file or click <span className="text-blue-400 font-semibold">"Run Review"</span> to generate security, performance, and architecture insights with automated diffs.
        </p>
      </div>
    );
  }

  const { overallScore = 85, scores = {}, issues = [], summary, suggestions = [], improvedCode } = currentReview;
  const hasImprovedCode = Boolean(improvedCode && activeFile && improvedCode.trim() !== (activeFile.content || '').trim());

  const filteredIssues = severityFilter === 'ALL'
    ? issues
    : issues.filter((i) => i.severity === severityFilter);

  return (
    <div className="w-full lg:w-80 xl:w-96 bg-[#0d1117] border-l border-white/10 flex flex-col h-full shrink-0 select-none animate-fade-in">
      {/* Header */}
      <div className="p-3.5 border-b border-white/10 bg-[#0a0e14] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">AI REVIEW REPORT</span>
        </div>
        <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
          {issues.length} Issues Found
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-3.5">
        {/* Overall Score Card */}
        <div className="p-4 bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-white/10 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Overall Code Health</span>
            <span className="text-2xl font-extrabold font-mono text-white mt-1 block">{overallScore} / 100</span>
            <span className={`text-[11px] font-semibold ${
              overallScore >= 90 ? 'text-emerald-400' : overallScore >= 75 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {overallScore >= 90 ? '✓ Healthy & Secure' : overallScore >= 75 ? '⚠ Optimizations Needed' : '✗ Critical Issues Detected'}
            </span>
          </div>

          <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-mono font-bold text-lg shadow-lg ${
            overallScore >= 90
              ? 'border-emerald-500/60 text-emerald-400 bg-emerald-950/30'
              : overallScore >= 75
              ? 'border-amber-500/60 text-amber-400 bg-amber-950/30'
              : 'border-rose-500/60 text-rose-400 bg-rose-950/30'
          }`}>
            {overallScore}%
          </div>
        </div>

        {summary && (
          <div className="rounded-2xl border border-white/10 bg-[#161b22] p-3.5 text-xs leading-relaxed text-gray-300">
            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
              <Eye className="h-3.5 w-3.5" /> Executive Summary
            </span>
            {summary}
          </div>
        )}

        {hasImprovedCode && (
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-center"
            icon={<Wand2 className="h-4 w-4" />}
            onClick={previewImprovedCode}
          >
            Preview AI Refactored Code
          </Button>
        )}

        {/* Category Breakdown Progress Bars */}
        <div className="p-3.5 bg-[#161b22] border border-white/10 rounded-2xl space-y-2.5 text-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Category Breakdown
          </span>

          <div className="space-y-1">
            <div className="flex justify-between text-gray-300">
              <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Security</span>
              <span className="font-mono text-emerald-400 font-bold">{scores.security ?? 85}%</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${scores.security ?? 85}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-gray-300">
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Performance</span>
              <span className="font-mono text-amber-400 font-bold">{scores.performance ?? 80}%</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${scores.performance ?? 80}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-gray-300">
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-purple-400" /> Maintainability</span>
              <span className="font-mono text-purple-400 font-bold">{scores.maintainability ?? 85}%</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${scores.maintainability ?? 85}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-gray-300">
              <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-blue-400" /> Readability</span>
              <span className="font-mono text-blue-400 font-bold">{scores.readability ?? 90}%</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${scores.readability ?? 90}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-gray-300">
              <span className="flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5 text-cyan-400" /> Best Practices</span>
              <span className="font-mono text-cyan-400 font-bold">{scores.bestPractices ?? 85}%</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${scores.bestPractices ?? 85}%` }} />
            </div>
          </div>
        </div>

        {suggestions && suggestions.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#161b22] p-3.5">
            <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
              <ListChecks className="h-3.5 w-3.5" /> Actionable Recommendations
            </span>
            <ol className="space-y-2 pl-4 text-xs leading-relaxed text-gray-300 list-decimal">
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <li key={`${index}-${suggestion}`}>{suggestion}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-[10px]">
          {['ALL', 'CRITICAL', 'WARNING', 'SUGGESTION', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold border transition-colors cursor-pointer ${
                severityFilter === sev
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-[#161b22] text-gray-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Issues List */}
        <div className="space-y-2.5">
          {filteredIssues.length === 0 ? (
            <div className="p-5 text-center text-xs text-gray-400 bg-[#161b22] border border-white/10 rounded-2xl">
              No issues match the selected filter.
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AIReviewPanel;
