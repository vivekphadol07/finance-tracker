import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center px-5 py-2.5 overflow-hidden font-bold rounded-xl transition-all duration-200 ease-out active:scale-95 text-sm";
  
  const variants = {
    primary:   "bg-brand-accent text-[#050507] font-black hover:brightness-110 shadow-lg shadow-brand-accent/10 accent-glow",
    secondary: "bg-white dark:bg-[#111115] text-slate-700 dark:text-[#dfe3ff] border border-slate-200 dark:border-[#1e1e26] hover:bg-slate-50 dark:hover:bg-[#16161c]",
    danger:    "bg-rose-50 dark:bg-[#1a0a0c] text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-500/15 hover:bg-rose-100 dark:hover:bg-[#200d0f]",
    ghost:     "bg-transparent text-slate-600 dark:text-[#cdd2ef] hover:bg-slate-100 dark:hover:bg-[#0d0d11] shadow-none hover:shadow-none"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
