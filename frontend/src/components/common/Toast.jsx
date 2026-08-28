import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { notifications, dismissNotification } = useUIStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => {
        const icons = {
          info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
        };

        const borderStyles = {
          info: 'border-blue-500/30 bg-[#161b22]/95 hover:border-blue-500/50 shadow-blue-500/10',
          success: 'border-emerald-500/30 bg-[#161b22]/95 hover:border-emerald-500/50 shadow-emerald-500/10',
          warning: 'border-amber-500/30 bg-[#161b22]/95 hover:border-amber-500/50 shadow-amber-500/10',
          error: 'border-rose-500/30 bg-[#161b22]/95 hover:border-rose-500/50 shadow-rose-500/10'
        };

        const iconColors = {
          info: 'text-blue-400',
          success: 'text-emerald-400',
          warning: 'text-amber-400',
          error: 'text-rose-400'
        };

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] ${borderStyles[n.type] || borderStyles.info}`}
          >
            <div className={`flex-shrink-0 mt-0.5 ${iconColors[n.type] || 'text-blue-400'}`}>
              {icons[n.type] || icons.info}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white">{n.title}</h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{n.message}</p>
              {n.time && (
                <span className="text-[10px] text-gray-400 font-mono mt-1.5 block">{n.time}</span>
              )}
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="flex-shrink-0 text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
