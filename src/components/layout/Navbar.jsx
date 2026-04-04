import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRole, toggleTheme } from '../../redux/Slices/uiSlice';
import { FaBars, FaUserCircle, FaShieldAlt, FaSun, FaMoon } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.ui?.role || 'Admin');
  const theme = useSelector((state) => state.ui?.theme || 'light');
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className={`min-h-16 border-b transition-all duration-300 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-y-2 px-3 py-2 sm:px-6 ${
      theme === 'dark' 
        ? 'bg-[#081122]/78 backdrop-blur-2xl border-[#1f3553]' 
        : 'bg-white/70 backdrop-blur-2xl border-slate-200/80 shadow-[0_10px_28px_rgba(14,165,233,0.08)]'
    }`}>
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-600 dark:text-[#d6daf3] hover:bg-slate-100 dark:hover:bg-cyan-400/10 transition-colors md:hidden"
        >
          <FaBars className="text-lg" />
        </button>
        <div className="flex min-w-0 flex-col">
          <h1 className={`truncate text-sm sm:text-base font-black leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {getGreeting()}, Vivek
          </h1>
          <p className="hidden sm:block text-[9px] text-slate-500 dark:text-[#bcc1dc] font-bold uppercase tracking-wider">Financial Overview</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`p-2 rounded-xl transition-all active:scale-95 ${
            theme === 'dark' 
              ? 'bg-cyan-400/10 text-cyan-300 hover:bg-cyan-300/15 border border-cyan-300/25' 
              : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-100'
          }`}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'light' ? <FaMoon fontSize={15} /> : <FaSun fontSize={15} />}
        </button>

        {/* Role Switcher */}
        <div className={`flex p-1 rounded-xl max-w-full overflow-x-auto ${
          theme === 'dark' 
            ? 'bg-cyan-300/[0.06] border border-[#20324b]' 
            : 'bg-slate-100/90 border border-slate-200'
        }`}>
          <button
            onClick={() => dispatch(setRole('Admin'))}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black whitespace-nowrap transition-all ${
              role === 'Admin' 
                ? (theme === 'dark' ? 'bg-brand-accent/15 text-cyan-300 border border-brand-accent/35 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]' : 'bg-white text-cyan-700 border border-cyan-100 shadow-sm') 
                : 'text-slate-600 dark:text-[#d7dbf4] hover:text-slate-800 dark:hover:text-cyan-200'
            }`}
          >
            <FaShieldAlt className="text-[10px]" /> Admin
          </button>
          <button
            onClick={() => dispatch(setRole('Viewer'))}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black whitespace-nowrap transition-all ${
              role === 'Viewer' 
                ? (theme === 'dark' ? 'bg-brand-accent/15 text-cyan-300 border border-brand-accent/35 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]' : 'bg-white text-cyan-700 border border-cyan-100 shadow-sm') 
                : 'text-slate-600 dark:text-[#d7dbf4] hover:text-slate-800 dark:hover:text-cyan-200'
            }`}
          >
            <FaUserCircle className="text-[10px]" /> Viewer
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

