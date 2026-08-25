import React from 'react';
import { useReviewStore } from '../../store/reviewStore';
import { FileCode, X } from 'lucide-react';

export const EditorTabs: React.FC = () => {
  const { openFiles, activeFile, setActiveFile, closeFile } = useReviewStore();

  if (openFiles.length === 0) return null;

  return (
    <div className="h-9 bg-[#0d1117] border-b border-[#30363d] flex items-center overflow-x-auto custom-scrollbar shrink-0 select-none text-xs">
      {openFiles.map((file) => {
        const isActive = activeFile?.path === file.path;
        return (
          <div
            key={file.path}
            onClick={() => setActiveFile(file)}
            className={`h-full px-3.5 flex items-center gap-2 border-r border-[#30363d] cursor-pointer group transition-colors duration-200 min-w-[130px] max-w-[200px] ${
              isActive
                ? 'bg-[#161b22] text-gray-200 font-medium border-t-2 border-t-[#C5A059]'
                : 'bg-[#0d1117] text-gray-500 hover:bg-[#161b22] hover:text-gray-300'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="truncate flex-1 font-mono text-[11px]">{file.name}</span>
            {file.isModified && (
              <span className="w-2 h-2 rounded-full bg-[#C5A059] shrink-0" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.path);
              }}
              className="p-0.5 rounded text-gray-500 opacity-0 group-hover:opacity-100 hover:text-[#C5A059] hover:bg-[#21262d] transition-all duration-200"
              aria-label="Close tab"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};