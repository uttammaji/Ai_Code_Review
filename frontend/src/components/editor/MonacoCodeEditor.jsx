import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useReviewStore } from '../../store/reviewStore';

export const MonacoCodeEditor = () => {
  const { activeFile, updateFileContent, currentReview, selectedIssue } = useReviewStore();
  const editorRef = useRef(null);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define custom Cyber Modern Dark theme
    monaco.editor.defineTheme('modern-dark-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6e7681', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72', fontStyle: 'bold' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'type', foreground: 'ffa657' },
        { token: 'function', foreground: 'd2a8ff' },
        { token: 'variable', foreground: 'e6edf3' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#e6edf3',
        'editor.lineHighlightBackground': '#161b22',
        'editorCursor.foreground': '#58a6ff',
        'editorWhitespace.foreground': '#30363d',
        'editorLineNumber.foreground': '#484f58',
        'editorLineNumber.activeForeground': '#58a6ff',
        'editorGutter.background': '#0d1117',
        'editorIndentGuide.background1': '#21262d',
        'editorIndentGuide.activeBackground1': '#30363d',
      }
    });

    monaco.editor.setTheme('modern-dark-theme');

    // Add inline review markers if review exists
    if (currentReview?.issues && monaco) {
      const markers = currentReview.issues.map((iss) => ({
        startLineNumber: iss.line || 1,
        startColumn: 1,
        endLineNumber: iss.line || 1,
        endColumn: 100,
        message: `[${iss.severity}] ${iss.title}: ${iss.description}`,
        severity:
          iss.severity === 'CRITICAL' || iss.severity === 'ERROR'
            ? monaco.MarkerSeverity.Error
            : iss.severity === 'WARNING'
            ? monaco.MarkerSeverity.Warning
            : monaco.MarkerSeverity.Info
      }));

      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelMarkers(model, 'ai-code-review', markers);
      }
    }
  };

  useEffect(() => {
    if (selectedIssue && editorRef.current) {
      editorRef.current.revealLineInCenter(selectedIssue.line || 1);
      editorRef.current.setPosition({ lineNumber: selectedIssue.line || 1, column: 1 });
      editorRef.current.focus();
    }
  }, [selectedIssue]);

  if (!activeFile) {
    return (
      <div className="flex-1 bg-[#0d1117] flex flex-col items-center justify-center text-gray-400 text-xs p-6">
        <p className="text-white font-bold text-sm mb-1">No file selected in workspace</p>
        <p className="text-xs text-gray-500">Select a file from the Explorer sidebar or open a project.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-[#0d1117] relative">
      <Editor
        height="100%"
        language={activeFile.language || 'javascript'}
        value={activeFile.content || ''}
        onChange={(val) => updateFileContent(activeFile.path, val || '')}
        onMount={handleEditorMount}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          padding: { top: 14 }
        }}
        loading={
          <div className="flex items-center justify-center h-full text-xs text-blue-400 bg-[#0d1117] animate-pulse">
            Initializing Code Editor...
          </div>
        }
      />
    </div>
  );
};

export default MonacoCodeEditor;
