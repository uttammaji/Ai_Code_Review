import React from 'react';
import { useGitHubStore } from '../../store/githubStore';
import { useReviewStore } from '../../store/reviewStore';
import { GitBranch, Wifi, CheckCircle2 } from 'lucide-react';

export const StatusBar = () => {
  const { selectedBranch } = useGitHubStore();
  const { activeFile, reviewLoading, reviewStep, currentReview } = useReviewStore();

  return (
    <footer className="h-6 bg-[#0a0e14] border-t border-white/10 text-gray-400 px-3 flex items-center justify-between z-20 shrink-0 select-none text-[11px] font-sans">
      {/* Left side: Branch, Sync status & File stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 hover:bg-white/5 hover:text-blue-400 px-2 py-0.5 rounded cursor-pointer transition-colors">
          <GitBranch className="w-3 h-3 text-blue-400" />
          <span className="font-mono text-xs">{selectedBranch || 'main'}</span>
        </div>

        <div className="flex items-center gap-1.5 hover:bg-white/5 px-2 py-0.5 rounded cursor-pointer transition-colors">
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span>API Connected</span>
        </div>

        {reviewLoading && (
          <div className="flex items-center gap-1.5 bg-blue-950/40 text-blue-400 border border-blue-800/40 px-2 py-0.5 rounded font-mono text-[10px] animate-pulse">
            <span>●</span>
            <span>{reviewStep}</span>
          </div>
        )}
      </div>

      {/* Right side: Editor stats, language & AI review status */}
      <div className="flex items-center gap-3">
        {currentReview && (
          <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full font-mono text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Score: {currentReview.overallScore}%</span>
          </div>
        )}

        <div className="hover:bg-white/5 hover:text-white px-2 py-0.5 rounded cursor-pointer font-mono transition-colors">
          Ln 42, Col 18
        </div>

        <div className="hover:bg-white/5 hover:text-white px-2 py-0.5 rounded cursor-pointer font-mono uppercase transition-colors">
          {activeFile?.language || 'JavaScript'}
        </div>

        <div className="hover:bg-white/5 hover:text-white px-2 py-0.5 rounded cursor-pointer font-mono transition-colors">
          UTF-8
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
