'use client';

import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
          <input
            ref={ref}
            className={`glass-input w-full py-2.5 rounded-xl text-sm placeholder:text-slate-500 transition-all ${
              Icon ? 'pl-10 pr-4' : 'px-4'
            } ${error ? 'border-rose-500/50 focus:border-rose-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
