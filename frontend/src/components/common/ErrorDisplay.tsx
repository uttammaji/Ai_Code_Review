import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null | unknown;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, className = '' }) => {
  if (!error) return null;

  // Convert error to string safely
  const errorMessage = typeof error === 'string' 
    ? error 
    : error instanceof Error 
      ? error.message 
      : JSON.stringify(error);

  if (!errorMessage || errorMessage === '{}') return null;

  return (
    <div className={`p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-sm text-rose-300 flex items-start gap-2 ${className}`}>
      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
      <span>{errorMessage}</span>
    </div>
  );
};
