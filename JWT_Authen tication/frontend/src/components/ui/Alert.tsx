'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export interface AlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'error',
  message,
  className = '',
}) => {
  const styles = {
    error: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
      icon: <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />,
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      icon: <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />,
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      icon: <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />,
    },
  };

  const current = styles[type];

  return (
    <div
      className={`p-3.5 rounded-xl border text-sm flex items-start gap-2.5 ${current.bg} ${className}`}
    >
      {current.icon}
      <span>{message}</span>
    </div>
  );
};
