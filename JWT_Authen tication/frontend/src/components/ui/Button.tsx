'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 border border-blue-500/30',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10',
    danger:
      'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {children}
          {icon}
        </>
      )}
    </button>
  );
};
