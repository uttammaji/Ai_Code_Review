import React from 'react';
import { useReviewStore } from '../../store/reviewStore';
import { FileCode, X } from 'lucide-react';

export const EditorTabs = () => {
  const { openFiles, activeFile, setActiveFile, closeFile } = useReviewStore();

  if (openFiles.length === 0) return null;

  return (
    <div className="h-10 bg-[#0a0e14] border-b border-white/10 flex items-center overflow-x-auto custom-scrollbar shrink-0 select-none text-xs">
      {openFiles.map((file) => {
        const isActive = activeFile?.path === file.path;
        return (
          <div
            key={file.path}
            onClick={() => setActiveFile(file)}
            className={`h-full px-4 flex items-center gap-2.5 border-r border-white/10 cursor-pointer group transition-all duration-200 min-w-[130px] max-w-[220px] ${
              isActive
                ? 'bg-[#0d1117] text-white font-semibold border-t-2 border-t-blue-500 shadow-inner'
                : 'bg-[#0a0e14] text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
            <span className="truncate flex-1 font-mono text-[11px]">{file.name}</span>
            {file.isModified && (
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.path);
              }}
              className="p-1 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
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

export default EditorTabs;
