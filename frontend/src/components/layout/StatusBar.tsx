import React from 'react';
import { useGitHubStore } from '../../store/githubStore';
import { useReviewStore } from '../../store/reviewStore';
import { GitBranch, Wifi, CheckCircle2, AlertCircle, Code2 } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { selectedBranch } = useGitHubStore();
  const { activeFile, reviewLoading, reviewStep, currentReview } = useReviewStore();

  return (
    <footer className="h-6 bg-[#0d1117] border-t border-[#30363d] text-gray-400 px-2 flex items-center justify-between z-20 shrink-0 select-none text-[11px] font-sans">
      {/* Left side: Branch, Sync status & File stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 hover:bg-[#161b22] hover:text-[#C5A059] px-1.5 py-0.5 rounded cursor-pointer transition-colors duration-200">
          <GitBranch className="w-3 h-3 text-[#C5A059]" />
          <span className="font-mono">{selectedBranch || 'main'}</span>
        </div>

        <div className="flex items-center gap-1 hover:bg-[#161b22] px-1.5 py-0.5 rounded cursor-pointer transition-colors duration-200">
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span>API Connected</span>
        </div>

        {reviewLoading && (
          <div className="flex items-center gap-1 bg-[#1a1508] text-[#C5A059] border border-[#30363d] px-2 py-0.5 rounded font-mono text-[10px]">
            <span>●</span>
            <span>{reviewStep}</span>
          </div>
        )}
      </div>

      {/* Right side: Editor stats, language & AI review status */}
      <div className="flex items-center gap-3">
        {currentReview && (
          <div className="flex items-center gap-1 bg-[#161b22] border border-[#30363d] px-1.5 py-0.5 rounded font-mono text-[#C5A059]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Score: {currentReview.overallScore}%</span>
          </div>
        )}

        <div className="hover:bg-[#161b22] hover:text-[#C5A059] px-1.5 py-0.5 rounded cursor-pointer font-mono transition-colors duration-200">
          Ln 42, Col 18
        </div>

        <div className="hover:bg-[#161b22] hover:text-[#C5A059] px-1.5 py-0.5 rounded cursor-pointer font-mono uppercase transition-colors duration-200">
          {activeFile?.language || 'JavaScript'}
        </div>

        <div className="hover:bg-[#161b22] hover:text-[#C5A059] px-1.5 py-0.5 rounded cursor-pointer font-mono transition-colors duration-200">
          UTF-8
        </div>
      </div>
    </footer>
  );
};