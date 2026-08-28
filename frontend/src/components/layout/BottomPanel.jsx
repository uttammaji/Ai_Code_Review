import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useReviewStore } from '../../store/reviewStore';
import { 
  AlertOctagon, 
  Terminal as TerminalIcon, 
  FileText, 
  X, 
  Code2
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const BottomPanel = () => {
  const { bottomPanelOpen, toggleBottomPanel, bottomTab, setBottomTab } = useUIStore();
  const { currentReview, setSelectedIssue, selectedIssue } = useReviewStore();

  if (!bottomPanelOpen) return null;

  const issues = currentReview?.issues || [];
  const criticalCount = issues.filter((i) => i.severity === 'CRITICAL' || i.severity === 'ERROR').length;
  const warningCount = issues.filter((i) => i.severity === 'WARNING').length;
  const suggestionCount = issues.filter((i) => i.severity === 'SUGGESTION' || i.severity === 'INFO').length;

  return (
    <div className="h-44 sm:h-52 md:h-56 bg-[#0d1117] border-t border-white/10 flex flex-col shrink-0 text-xs font-mono select-none">
      {/* Panel Header & Tabs */}
      <div className="h-8 bg-[#0a0e14] border-b border-white/10 px-3 flex items-center justify-between overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setBottomTab('problems')}
            className={`px-3 py-1 flex items-center gap-2 border-b-2 font-sans transition-colors cursor-pointer ${
              bottomTab === 'problems'
                ? 'border-blue-500 text-blue-400 font-bold bg-[#161b22]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>PROBLEMS</span>
            <span className="bg-[#161b22] text-blue-400 border border-blue-500/30 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {issues.length}
            </span>
          </button>

          <button
            onClick={() => setBottomTab('review')}
            className={`px-3 py-1 flex items-center gap-2 border-b-2 font-sans transition-colors cursor-pointer ${
              bottomTab === 'review'
                ? 'border-purple-500 text-purple-400 font-bold bg-[#161b22]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>AI REVIEW</span>
            {currentReview && (
              <span className="bg-[#161b22] text-purple-400 border border-purple-500/30 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {currentReview.overallScore}%
              </span>
            )}
          </button>

          <button
            onClick={() => setBottomTab('terminal')}
            className={`px-3 py-1 flex items-center gap-2 border-b-2 font-sans transition-colors cursor-pointer ${
              bottomTab === 'terminal'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-[#161b22]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>TERMINAL</span>
          </button>

          <button
            onClick={() => setBottomTab('output')}
            className={`px-3 py-1 flex items-center gap-2 border-b-2 font-sans transition-colors cursor-pointer ${
              bottomTab === 'output'
                ? 'border-amber-500 text-amber-400 font-bold bg-[#161b22]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>OUTPUT</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleBottomPanel}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-[#0d1117]">
        {bottomTab === 'problems' && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-1 font-sans px-2">
              <span className="text-rose-400 font-bold">{criticalCount} Critical/Errors</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">{warningCount} Warnings</span>
              <span>•</span>
              <span className="text-blue-400 font-bold">{suggestionCount} Suggestions</span>
            </div>

            {issues.length === 0 ? (
              <div className="p-6 text-center text-gray-400 font-sans text-xs">
                No problems detected in workspace code. Everything is clean!
              </div>
            ) : (
              issues.map((iss) => (
                <button
                  key={iss.id}
                  onClick={() => setSelectedIssue(iss)}
                  className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                    selectedIssue?.id === iss.id
                      ? 'bg-[#161b22] border-blue-500 text-white shadow-md'
                      : 'bg-[#161b22]/50 border-white/5 text-gray-300 hover:border-blue-500/30'
                  }`}
                >
                  <Badge severity={iss.severity}>{iss.severity}</Badge>
                  <div className="flex-1 min-w-0 font-sans">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="truncate text-white">{iss.title}</span>
                      <span className="font-mono text-[11px] text-blue-400 shrink-0">
                        {iss.file}:{iss.line}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">{iss.description}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {bottomTab === 'review' && (
          <div className="font-sans text-xs text-gray-200 p-2">
            {currentReview ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3.5 bg-[#161b22] border border-white/10 rounded-2xl shadow-sm">
                  <div>
                    <span className="text-gray-400 block text-[10px] font-mono">PROJECT ANALYSIS</span>
                    <span className="font-bold text-sm text-white">{currentReview.projectName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px] font-mono">QUALITY SCORE</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">{currentReview.overallScore} / 100</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-[#161b22] border border-white/10 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Security</span>
                    <span className="font-mono font-bold text-emerald-400">{currentReview.scores.security}%</span>
                  </div>
                  <div className="p-2.5 bg-[#161b22] border border-white/10 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Performance</span>
                    <span className="font-mono font-bold text-amber-400">{currentReview.scores.performance}%</span>
                  </div>
                  <div className="p-2.5 bg-[#161b22] border border-white/10 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Maintainability</span>
                    <span className="font-mono font-bold text-purple-400">{currentReview.scores.maintainability}%</span>
                  </div>
                  <div className="p-2.5 bg-[#161b22] border border-white/10 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Readability</span>
                    <span className="font-mono font-bold text-blue-400">{currentReview.scores.readability}%</span>
                  </div>
                  <div className="p-2.5 bg-[#161b22] border border-white/10 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Best Practices</span>
                    <span className="font-mono font-bold text-cyan-400">{currentReview.scores.bestPractices}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-6">
                No active code review report available. Click "Run Review" in the top bar to inspect your code with AI.
              </div>
            )}
          </div>
        )}

        {bottomTab === 'terminal' && (
          <div className="text-xs text-gray-300 font-mono space-y-1.5 p-2">
            <p className="text-emerald-400">$ ai-code-review-engine v2.5.0 online</p>
            <p className="text-gray-400">[info] AST static analysis engine initialized</p>
            <p className="text-gray-400">[security] Vulnerability scanners active: SQLi, XSS, SSRF, JWT checks</p>
            <p className="text-blue-400">&gt; Ready for commands (press Ctrl+K to open palette)...</p>
          </div>
        )}

        {bottomTab === 'output' && (
          <div className="text-xs text-gray-400 font-mono space-y-1.5 p-2">
            <p>[System] JSX frontend initialized with fast Vite build pipelines.</p>
            <p>[Monaco Editor] Multi-language workers mounted successfully.</p>
            <p>[AI Pipeline] Gemini Flash models ready for review generation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomPanel;
