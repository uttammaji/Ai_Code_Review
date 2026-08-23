import React from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { useReviewStore } from '../../store/reviewStore';
import { X, Check, Copy } from 'lucide-react';
import { Button } from '../common/Button';

export const MonacoDiffViewer: React.FC = () => {
  const {
    activeDiffIssue,
    setDiffViewActive,
    activeFile,
    updateFileContent,
  } = useReviewStore();

  const [copied, setCopied] = React.useState(false);

  const handleApplyFix = React.useCallback(() => {
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
  }, [
    activeDiffIssue,
    activeFile,
    updateFileContent,
    setDiffViewActive,
  ]);

  const handleCopy = React.useCallback(async () => {
    if (!activeDiffIssue) {
      return;
    }

    const modifiedCode =
      activeDiffIssue.suggestedCode ||
      activeDiffIssue.suggestedFix ||
      '';

    try {
      await navigator.clipboard.writeText(modifiedCode);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [activeDiffIssue]);

  const handleClose = React.useCallback(() => {
    setDiffViewActive(false);
  }, [setDiffViewActive]);

  // Do not render Monaco when there is no active issue.
  if (!activeDiffIssue) {
    return null;
  }

  const originalCode =
    activeDiffIssue.originalCode ||
    activeFile?.content ||
    '';

  const modifiedCode =
    activeDiffIssue.suggestedCode ||
    activeDiffIssue.suggestedFix ||
    '';

  /*
   * A stable key prevents React from unnecessarily destroying
   * and recreating the Monaco DiffEditor.
   */
  const editorKey = React.useMemo(() => {
    return [
      activeFile?.path || 'no-file',
      activeDiffIssue.line || 'no-line',
      activeDiffIssue.title || 'no-title',
    ].join('-');
  }, [
    activeFile?.path,
    activeDiffIssue.line,
    activeDiffIssue.title,
  ]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[80vh] bg-[#111111] border border-[rgba(197,160,89,0.25)] rounded shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-4 py-3 bg-[#0A0A0A] border-b border-[rgba(197,160,89,0.18)] flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#D4CFC9] font-serif flex items-center gap-2">
              <span className="truncate">
                Diff View: {activeDiffIssue.title}
              </span>

              <span className="text-xs font-mono text-[#C5A059] whitespace-nowrap">
                Line {activeDiffIssue.line}
              </span>
            </h3>

            <p className="text-xs text-[#D4CFC9]/60 mt-0.5 truncate">
              {activeDiffIssue.description}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">

            {/* Copy */}
            <Button
              variant="outline"
              size="sm"
              icon={<Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy Fix'}
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
              className="p-1 text-[#D4CFC9]/60 hover:text-[#C5A059] rounded hover:bg-[#141414]"
              aria-label="Close diff viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Monaco Diff Editor */}
        <div className="flex-1 bg-[#0A0A0A] relative min-h-0">
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

              minimap: {
                enabled: false,
              },

              scrollBeyondLastLine: false,

              wordWrap: 'on',

              folding: true,

              lineNumbers: 'on',

              renderOverviewRuler: false,

              overviewRulerBorder: false,

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
              <div className="h-full flex items-center justify-center bg-[#0A0A0A] text-[#D4CFC9]/60 text-sm">
                Loading diff editor...
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};