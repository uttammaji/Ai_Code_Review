import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, dismissNotification } = useUIStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => {
        const icons = {
          info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          error: <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
        };

        const borderStyles = {
          info: 'border-blue-500/30 bg-[#161b22] hover:border-blue-500/50',
          success: 'border-emerald-500/30 bg-[#161b22] hover:border-emerald-500/50',
          warning: 'border-amber-500/30 bg-[#161b22] hover:border-amber-500/50',
          error: 'border-rose-500/30 bg-[#161b22] hover:border-rose-500/50'
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
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-200 hover:shadow-xl ${borderStyles[n.type]}`}
          >
            <div className={`flex-shrink-0 mt-0.5 ${iconColors[n.type]}`}>
              {icons[n.type]}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-200">{n.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
              {n.time && (
                <span className="text-[10px] text-gray-500 mt-1.5 block">{n.time}</span>
              )}
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="flex-shrink-0 text-gray-500 hover:text-gray-300 hover:bg-[#21262d] p-1 rounded-lg transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};