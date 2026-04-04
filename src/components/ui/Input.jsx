import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label className="text-[9px] font-black text-slate-500 dark:text-[#c3c7df] uppercase tracking-[0.12em]">
          {label}
        </label>
      )}
      <input
        className={`px-4 py-2.5 rounded-xl border bg-white dark:bg-[#0d0d11] transition-colors duration-200
          focus:outline-none focus:ring-1 focus:ring-brand-accent/40
          ${error
            ? 'border-rose-500/30 focus:border-rose-500/50'
            : 'border-slate-200 dark:border-[#1e1e26] focus:border-brand-accent/40'}
          text-slate-900 dark:text-[#f1f4ff] placeholder-slate-400 dark:placeholder-[#878ba7] text-sm`}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-rose-400 mt-1">{error}</span>
      )}
    </div>
  );
};
