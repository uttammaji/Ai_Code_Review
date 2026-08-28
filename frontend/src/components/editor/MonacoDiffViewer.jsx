import React, { useState, useCallback, useMemo } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { useReviewStore } from '../../store/reviewStore';
import { X, Check, Copy } from 'lucide-react';
import { Button } from '../common/Button';

export const MonacoDiffViewer = () => {
  const {
    activeDiffIssue,
    setDiffViewActive,
    activeFile,
    updateFileContent,
  } = useReviewStore();

  const [copied, setCopied] = useState(false);

  const handleApplyFix = useCallback(() => {
    if (!activeDiffIssue || !activeFile) {
      return;
    }

    if (!activeDiffIssue.suggestedCode) {
      setDiffViewActive(false);
      return;
    }

    const originalCode = activeDiffIssue.originalCode || '';

    const updatedContent = activeFile.content?.replace(
      originalCode,
      activeDiffIssue.suggestedCode
    );

    if (updatedContent && updatedContent !== activeFile.content) {
      updateFileContent(activeFile.path, updatedContent);
    }

    setDiffViewActive(false);
  }, [activeDiffIssue, activeFile, updateFileContent, setDiffViewActive]);

  const handleCopy = useCallback(async () => {
    if (!activeDiffIssue) return;

    const modifiedCode =
      activeDiffIssue.suggestedCode ||
      activeDiffIssue.suggestedFix ||
      '';

    try {
      await navigator.clipboard.writeText(modifiedCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [activeDiffIssue]);

  const handleClose = useCallback(() => {
    setDiffViewActive(false);
  }, [setDiffViewActive]);

  // ✅ MOVED: useMemo BEFORE the conditional return
  const editorKey = useMemo(() => {
    return [
      activeFile?.path || 'no-file',
      activeDiffIssue?.line || 'no-line',
      activeDiffIssue?.title || 'no-title',
    ].join('-');
  }, [activeFile?.path, activeDiffIssue?.line, activeDiffIssue?.title]);

  // ✅ EARLY RETURN now comes AFTER all hooks
  if (!activeDiffIssue) return null;

  const originalCode =
    activeDiffIssue.originalCode ||
    activeFile?.content ||
    '';

  const modifiedCode =
    activeDiffIssue.suggestedCode ||
    activeDiffIssue.suggestedFix ||
    '';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-5xl h-[82vh] bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a0e14] border-b border-white/10 flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="truncate">
                Diff Preview: {activeDiffIssue.title}
              </span>
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 whitespace-nowrap">
                Line {activeDiffIssue.line}
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-1 truncate">
              {activeDiffIssue.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 ml-4 shrink-0">
            {/* Copy */}
            <Button
              variant="outline"
              size="sm"
              icon={<Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy Fix'}
            </Button>

            {/* Apply */}
            <Button
              variant="primary"
              size="sm"
              icon={<Check className="w-3.5 h-3.5" />}
              onClick={handleApplyFix}
            >
              Apply Fix
            </Button>

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close diff viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Monaco Diff Editor */}
        <div className="flex-1 bg-[#0d1117] relative min-h-0">
          <DiffEditor
            key={editorKey}
            height="100%"
            language={activeFile?.language || 'javascript'}
            original={originalCode}
            modified={modifiedCode}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              readOnly: true,
              automaticLayout: true,
              renderSideBySide: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              folding: true,
              lineNumbers: 'on',
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
              diffWordWrap: 'on',
              ignoreTrimWhitespace: false,
              renderIndicators: true,
              originalEditable: false,
            }}
            loading={
              <div className="h-full flex items-center justify-center bg-[#0d1117] text-gray-400 text-sm animate-pulse">
                Loading diff comparison...
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MonacoDiffViewer;