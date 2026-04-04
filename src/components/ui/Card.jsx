import React from 'react';

export const Card = ({ children, title, className = '', headerAction }) => {
  return (
    <div className={`bg-white/85 dark:bg-[#0d172b]/80 rounded-2xl border border-slate-200/80 dark:border-[#20324b] overflow-hidden flex flex-col transition-all duration-300 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)] backdrop-blur-xl ${className}`}>
      {(title || headerAction) && (
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-[#20324b] flex flex-wrap justify-between items-center gap-2 bg-white/55 dark:bg-[#091224]/70 sticky top-0 z-10 shrink-0">
          <h3 className="text-[9px] font-black text-slate-500 dark:text-[#b9c6e5] uppercase tracking-widest">{title}</h3>
          {headerAction}
        </div>
      )}
      <div className="p-4 sm:p-6 text-slate-800 dark:text-[#f1f4ff] flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
};

export default Card;
