import React, { useRef, useState, useEffect } from 'react';
import { EditorTabs } from '../components/editor/EditorTabs';
import { MonacoCodeEditor } from '../components/editor/MonacoCodeEditor';
import { AIReviewPanel } from '../components/review/AIReviewPanel';
import {
  Code2,
  FileUp,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  GitBranch,
  Download,
  Play,
  Settings,
  Maximize2,
  Minimize2,
  Terminal,
  X
} from 'lucide-react';
import { useReviewStore } from '../store/reviewStore';
import { useUIStore } from '../store/uiStore';
import { Badge } from '../components/common/Badge';

const languageFromFileName = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const languages: Record<string, string> = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', java: 'java', c: 'c', cpp: 'cpp', cc: 'cpp', hpp: 'cpp',
    go: 'go', rs: 'rust', json: 'json', html: 'html', css: 'css',
    scss: 'scss', less: 'less', md: 'markdown', yml: 'yaml', yaml: 'yaml',
    xml: 'xml', svg: 'xml', sh: 'shell', bash: 'shell', zsh: 'shell',
    sql: 'sql', graphql: 'graphql', vue: 'vue', svelte: 'svelte'
  };
  return languages[extension || ''] || 'plaintext';
};

export const Review: React.FC = () => {
  const [mobileTab, setMobileTab] = useState<'editor' | 'review'>('editor');
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [isReviewPanelCollapsed, setIsReviewPanelCollapsed] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentReview, openFile, activeFile } = useReviewStore();
  const { addNotification } = useUIStore();

  // Auto-switch to review tab when review results come in
  useEffect(() => {
    if (currentReview && mobileTab === 'editor') {
      // Small delay to let user see the result before switching
      const timer = setTimeout(() => {
        setMobileTab('review');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentReview, mobileTab]);

  const handleLocalFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setFileError(null);

    if (!file) return;

    // Check file size (50KB limit)
    if (file.size > 50_000) {
      setFileError('File too large (max 50KB)');
      addNotification({
        title: 'File too large',
        message: 'Please choose a source file smaller than 50 KB for review.',
        type: 'error'
      });
      return;
    }

    // Check file type
    const validExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp', '.cc', '.hpp', '.go', '.rs', '.json', '.html', '.css', '.txt', '.md', '.yml', '.yaml', '.xml', '.sh', '.sql', '.graphql', '.vue', '.svelte'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.'));
    if (!validExtensions.includes(fileExt)) {
      setFileError('Unsupported file type');
      addNotification({
        title: 'Unsupported file',
        message: `Please select a supported source file (${validExtensions.join(', ')})`,
        type: 'error'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      if (!content.trim()) {
        setFileError('File is empty');
        addNotification({
          title: 'Empty file',
          message: 'The selected file appears to be empty.',
          type: 'warning'
        });
        return;
      }

      openFile({
        id: `local-${Date.now()}`,
        name: file.name,
        path: `local/${file.name}`,
        type: 'file',
        language: languageFromFileName(file.name),
        content: content,
        isModified: false,
      });
      setFileError(null);
      addNotification({
        title: 'File loaded',
        message: `${file.name} (${Math.round(content.length / 1024)}KB) is ready for review.`,
        type: 'success'
      });
      setMobileTab('editor');
    };
    reader.onerror = () => {
      setFileError('Failed to read file');
      addNotification({
        title: 'Unable to read file',
        message: 'Please select a valid text-based source file.',
        type: 'error'
      });
    };
    reader.readAsText(file);
  };

  const toggleFullscreen = () => {
    setIsEditorFullscreen(!isEditorFullscreen);
  };

  const toggleReviewPanel = () => {
    setIsReviewPanelCollapsed(!isReviewPanelCollapsed);
  };

  const getFileSize = () => {
    if (!activeFile) return '';
    const size = activeFile.content?.length || 0;
    if (size > 1024) return `${Math.round(size / 1024)}KB`;
    return `${size}B`;
  };

  return (
    <div className={`flex-1 flex flex-col lg:flex-row min-h-0 min-w-0 bg-gradient-to-br from-[#0A0A0A] to-[#111111] overflow-hidden relative ${isEditorFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.cc,.hpp,.go,.rs,.json,.html,.css,.txt,.md,.yml,.yaml,.xml,.sh,.sql,.graphql,.vue,.svelte"
        onChange={handleLocalFile}
      />

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden bg-[#0A0A0A] border-b border-[#30363d] px-3 py-1.5 shrink-0 z-10 gap-2">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${mobileTab === 'editor'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-[#161b22] text-gray-400 hover:text-white hover:bg-[#21262d]'
            }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Editor</span>
          {activeFile && (
            <Badge variant="info" size="sm" className="bg-white/10 text-white border-none text-[9px]">
              {activeFile.name.split('.').pop()}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setMobileTab('review')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${mobileTab === 'review'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-[#161b22] text-gray-400 hover:text-white hover:bg-[#21262d]'
            }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Review</span>
          {currentReview && (
            <Badge variant="success" size="sm" className="bg-white/10 text-white border-none text-[9px]">
              {currentReview.overallScore}%
            </Badge>
          )}
        </button>
      </div>

      {/* File Upload Button - Floating */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute right-3 top-3 z-20 flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] px-3.5 py-2 text-sm font-medium text-gray-300 transition-all hover:border-blue-500 hover:bg-[#21262d] hover:text-white shadow-lg shadow-black/20 group"
        title="Open a local source file"
      >
        <FileUp className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Open file</span>
        <span className="text-[10px] text-gray-500 hidden lg:inline font-mono">⌘O</span>
      </button>

      {/* Editor Controls */}
      <div className="absolute right-3 top-16 z-20 flex flex-col gap-1">
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-[#161b22] border border-[#30363d] text-gray-400 hover:text-white hover:bg-[#21262d] transition-all"
          title={isEditorFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isEditorFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
        {isEditorFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-[#161b22] border border-[#30363d] text-rose-400 hover:text-rose-300 hover:bg-[#21262d] transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Editor Section */}
      <div className={`flex-1 flex-col min-w-0 h-full overflow-hidden ${mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
        {/* Editor Tabs with enhanced styling */}
        <div className="border-b border-[#30363d] bg-[#0d1117]">
          <div className="flex items-center justify-between px-3">
            <EditorTabs />
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              {activeFile && (
                <>
                  <span className="flex items-center gap-1">
                    <Code2 className="w-3 h-3" />
                    {activeFile.name.split('.').pop()}
                  </span>
                  <span className="w-px h-3 bg-[#30363d]" />
                  <span>{getFileSize()}</span>
                  {activeFile.isModified && (
                    <>
                      <span className="w-px h-3 bg-[#30363d]" />
                      <span className="text-amber-400">● Modified</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Monaco Editor Container with enhanced styling */}
        <div className="flex-1 relative overflow-hidden flex bg-[#0d1117]">
          <MonacoCodeEditor />
          {!activeFile && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-4">
                <div className="inline-flex p-4 bg-[#161b22] rounded-full border border-[#30363d]">
                  <Code2 className="w-12 h-12 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">No file open</h3>
                  <p className="text-sm text-gray-500 mt-1">Open a file from the project explorer or upload one</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="pointer-events-auto px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-all"
                >
                  <FileUp className="w-4 h-4 inline mr-2" />
                  Upload a file
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Review Panel with toggle */}
      <div className={`h-full ${mobileTab === 'review' ? 'flex flex-1 w-full' : 'hidden lg:flex'} ${isReviewPanelCollapsed ? 'lg:w-12' : 'lg:w-2/5 xl:w-1/3'}`}>
        <AIReviewPanel />
      </div>

      {/* File Error Toast */}
      {fileError && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 p-3 bg-rose-950/90 border border-rose-800/60 rounded-xl text-sm text-rose-300 flex items-center gap-2 shadow-2xl backdrop-blur-sm animate-slideUp">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{fileError}</span>
          <button
            onClick={() => setFileError(null)}
            className="text-rose-400 hover:text-rose-300 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status Bar */}
      <div className="hidden lg:flex items-center justify-between px-4 py-1.5 bg-[#0d1117] border-t border-[#30363d] text-[10px] text-gray-500 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3" />
            {activeFile ? `Editing: ${activeFile.name}` : 'No file open'}
          </span>
          {activeFile && (
            <>
              <span className="w-px h-3 bg-[#30363d]" />
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                main
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {currentReview ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              Review complete: {currentReview.overallScore}%
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-gray-500">
              <Clock className="w-3 h-3" />
              Ready for review
            </span>
          )}
          <span className="w-px h-3 bg-[#30363d]" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Secure connection
          </span>
        </div>
      </div>
    </div>
  );
};