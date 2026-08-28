import React, { useRef, useState, useEffect } from 'react';
import { MonacoCodeEditor } from '../components/editor/MonacoCodeEditor';
import { EditorTabs } from '../components/editor/EditorTabs';
import { AIReviewPanel } from '../components/review/AIReviewPanel';
import { useReviewStore } from '../store/reviewStore';
import { useUIStore } from '../store/uiStore';
import { FileUp, Code2, Play } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const Review = () => {
  const { openFile, activeFile, runReview, reviewLoading, currentReview } = useReviewStore();
  const { addNotification } = useUIStore();
  const fileInputRef = useRef(null);
  const [mobileTab, setMobileTab] = useState('editor');

  const handleLocalFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      const ext = file.name.split('.').pop() || '';
      const languageMap = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        py: 'python',
        go: 'go',
        java: 'java',
        cpp: 'cpp',
        rs: 'rust',
        html: 'html',
        css: 'css',
        json: 'json',
      };

      openFile({
        name: file.name,
        path: `local/${file.name}`,
        content,
        language: languageMap[ext.toLowerCase()] || 'javascript',
      });

      addNotification({
        title: 'File Opened',
        message: `Loaded ${file.name} into review workspace.`,
        type: 'success',
      });
    };
    reader.readAsText(file);
  };

  const handleRunAiReview = () => {
    if (activeFile) {
      runReview({
        code: activeFile.content || '',
        fileName: activeFile.name,
        language: activeFile.language || 'JavaScript',
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0 min-w-0 bg-[#0d1117] overflow-hidden relative select-none">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.go,.rs,.json,.html,.css,.txt,.md,.sql"
        onChange={handleLocalFile}
      />

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden bg-[#0a0e14] border-b border-white/10 px-3 py-2 shrink-0 z-10 gap-2">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mobileTab === 'editor'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-[#161b22] text-gray-400'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Editor</span>
        </button>
        <button
          onClick={() => setMobileTab('review')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mobileTab === 'review'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-[#161b22] text-gray-400'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>AI Review</span>
          {currentReview && (
            <Badge variant="success" size="sm" className="bg-white/10 text-white border-none text-[9px]">
              {currentReview.overallScore}%
            </Badge>
          )}
        </button>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute right-4 top-3 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#161b22]/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-gray-200 transition-all hover:border-blue-500/40 hover:text-white shadow-lg cursor-pointer"
          title="Open a local file"
        >
          <FileUp className="h-3.5 w-3.5 text-blue-400" />
          <span className="hidden sm:inline">Open File</span>
        </button>

        <button
          type="button"
          onClick={handleRunAiReview}
          disabled={reviewLoading || !activeFile}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-all shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>{reviewLoading ? 'Reviewing...' : 'Scan Code'}</span>
        </button>
      </div>

      {/* Editor Section */}
      <div className={`flex-1 flex-col min-w-0 h-full overflow-hidden ${mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
        <EditorTabs />
        <div className="flex-1 min-h-0 relative">
          <MonacoCodeEditor />
        </div>
      </div>

      {/* AI Review Panel */}
      <div className={`h-full min-w-0 ${mobileTab === 'review' ? 'flex flex-1' : 'hidden lg:flex'}`}>
        <AIReviewPanel />
      </div>
    </div>
  );
};

export default Review;
