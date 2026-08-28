import React from 'react';
import { Badge } from '../common/Badge';
import { useReviewStore } from '../../store/reviewStore';
import { Button } from '../common/Button';
import { Code2 } from 'lucide-react';

export const IssueCard = ({ issue }) => {
  const { selectedIssue, setSelectedIssue, setDiffViewActive } = useReviewStore();
  const isSelected = selectedIssue?.id === issue.id;

  return (
    <div
      onClick={() => setSelectedIssue(issue)}
      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-[#161b22] border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
          : 'bg-[#161b22]/60 border-white/5 hover:border-blue-500/30 hover:bg-[#161b22]'
      }`}
    >
      {/* Header & Badges */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <Badge severity={issue.severity}>{issue.severity}</Badge>
        <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
          {issue.file}:{issue.line}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-xs font-bold text-white leading-snug mb-1.5">
        {issue.title}
      </h4>

      {/* Description */}
      <p className="text-xs text-gray-300 leading-relaxed mb-3">
        {issue.description}
      </p>

      {/* Why it matters */}
      {issue.whyItMatters && (
        <div className="bg-[#0d1117] p-2.5 rounded-xl border border-white/5 mb-2.5 text-[11px]">
          <span className="font-bold text-amber-400 block mb-0.5">Impact Analysis:</span>
          <span className="text-gray-400 leading-relaxed">{issue.whyItMatters}</span>
        </div>
      )}

      {/* Suggested fix */}
      {issue.suggestedFix && (
        <div className="text-[11px] text-gray-400 mb-3">
          <span className="font-bold text-emerald-400 block mb-0.5">Suggested Fix:</span>
          <span className="text-gray-400">{issue.suggestedFix}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <Button
          variant="secondary"
          size="sm"
          icon={<Code2 className="w-3.5 h-3.5 text-blue-400" />}
          onClick={(e) => {
            e.stopPropagation();
            setDiffViewActive(true, issue);
          }}
          className="w-full justify-center"
        >
          Compare & Apply Diff
        </Button>
      </div>
    </div>
  );
};

export default IssueCard;
