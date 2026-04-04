import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../../redux/Slices/uiSlice';
import { 
  FaChartLine, 
  FaExchangeAlt, 
  FaWallet, 
  FaCog, 
  FaChevronLeft, 
  FaChevronRight,
  FaHome,
  FaFileInvoiceDollar
} from 'react-icons/fa';

const SidebarItem = ({ icon: Icon, label, isOpen, active, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
        active 
          ? 'bg-brand-accent/14 text-cyan-700 dark:text-cyan-300 font-bold shadow-[inset_0_0_0_1px_rgba(34,211,238,0.15)]' 
          : 'text-slate-600 dark:text-[#d1d6f0] hover:bg-slate-100 dark:hover:bg-cyan-400/10 hover:text-slate-800 dark:hover:text-cyan-200'
      }`}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-accent rounded-full" />
      )}
      <div className="text-lg">
        <Icon />
      </div>
      {isOpen && (
        <span className="font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300 text-sm">
          {label}
        </span>
      )}
      {!isOpen && (
        <div className="absolute left-16 bg-white/95 dark:bg-[#0d172a]/95 border border-slate-200 dark:border-[#20324b] text-slate-700 dark:text-[#e2e6ff] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none text-xs font-semibold shadow-xl backdrop-blur-md">
          {label}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar, onNavigate = () => {} }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.ui.activeTab);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine },
    { id: 'transactions', label: 'Transactions', icon: FaExchangeAlt },
    { id: 'budgets', label: 'Budgets', icon: FaWallet },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-white/75 dark:bg-[#081121]/88 border-r border-slate-200/80 dark:border-[#20324b] transition-all duration-300 z-40 flex flex-col backdrop-blur-2xl ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-20 md:translate-x-0'}`}
    >
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/80 dark:border-[#20324b] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-brand-accent flex items-center justify-center shrink-0 accent-glow">
            <FaFileInvoiceDollar className="text-brand-bg text-base" />
          </div>
          {isOpen && (
            <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
              FinaTracker
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <SidebarItem 
            key={item.id}
            icon={item.icon} 
            label={item.label} 
            isOpen={isOpen} 
            active={activeTab === item.id}
            onClick={() => {
              dispatch(setActiveTab(item.id));
              onNavigate();
            }}
          />
        ))}
      </nav>

      <div className="p-4 bg-white/70 dark:bg-[#081121]/85 border-t border-slate-200/80 dark:border-[#20324b] shrink-0">
        <button 
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-cyan-300/[0.06] text-slate-600 dark:text-[#d1d6f0] hover:text-cyan-700 dark:hover:text-cyan-300 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-cyan-400/10 border border-slate-200/80 dark:border-[#20324b]"
        >
          {isOpen ? <FaChevronLeft className="text-sm" /> : <FaChevronRight className="text-sm" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

