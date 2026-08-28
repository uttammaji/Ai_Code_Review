import React from 'react';

export const Badge = ({
  severity,
  variant,
  children,
  className = '',
  size = 'sm'
}) => {
  let colorStyle = 'bg-gray-800/80 text-gray-300 border-gray-700/80';

  if (severity) {
    switch (severity) {
      case 'CRITICAL':
        colorStyle = 'bg-rose-950/80 text-rose-300 border-rose-700/70 shadow-sm shadow-rose-950/40 font-semibold';
        break;
      case 'ERROR':
        colorStyle = 'bg-rose-950/50 text-rose-400 border-rose-800/60 font-medium';
        break;
      case 'WARNING':
        colorStyle = 'bg-amber-950/40 text-amber-300 border-amber-600/40 font-medium';
        break;
      case 'SUGGESTION':
        colorStyle = 'bg-blue-950/50 text-blue-300 border-blue-700/50 font-medium';
        break;
      case 'INFO':
        colorStyle = 'bg-cyan-950/30 text-cyan-300 border-cyan-800/30 font-normal';
        break;
      default:
        colorStyle = 'bg-[#161b22] text-gray-300 border-gray-700';
    }
  } else if (variant) {
    switch (variant) {
      case 'success':
        colorStyle = 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50';
        break;
      case 'warning':
        colorStyle = 'bg-amber-950/50 text-amber-300 border-amber-700/50';
        break;
      case 'danger':
        colorStyle = 'bg-rose-950/70 text-rose-300 border-rose-700/60';
        break;
      case 'info':
        colorStyle = 'bg-blue-950/50 text-blue-300 border-blue-700/50';
        break;
      case 'purple':
        colorStyle = 'bg-purple-950/50 text-purple-300 border-purple-700/50';
        break;
      default:
        colorStyle = 'bg-[#161b22] text-gray-300 border-gray-700';
    }
  }

  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border font-mono uppercase tracking-wider backdrop-blur-sm transition-colors ${colorStyle} ${sizeStyle} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
