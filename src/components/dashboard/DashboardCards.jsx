import React from 'react';
import { FaWallet, FaArrowUp, FaArrowDown, FaPiggyBank } from 'react-icons/fa';

const StatCard = ({ title, amount, icon: Icon, ringColor, iconColor, trend }) => (
  <div className="bg-white/85 dark:bg-[#0e172b]/78 border border-slate-200/80 dark:border-[#20324b] rounded-2xl p-3 sm:p-5 flex items-start justify-between gap-3 transition-all duration-200 hover:border-cyan-200 dark:hover:border-cyan-300/30 group shadow-[0_10px_28px_rgba(15,23,42,0.07)] dark:shadow-[0_14px_30px_rgba(2,6,23,0.4)] backdrop-blur-xl">
    <div className="space-y-1 sm:space-y-1.5 min-w-0">
      <p className="text-[9px] font-black text-slate-500 dark:text-[#bcc0da] uppercase tracking-[0.12em]">{title}</p>
      <h3 className="text-[clamp(1.35rem,4.8vw,2rem)] leading-tight font-black text-slate-900 dark:text-white tabular-nums">{`\u20B9${amount.toLocaleString()}`}</h3>
      {trend && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
            trend > 0 ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300' : 'bg-rose-500/10 text-rose-500 dark:text-rose-300'
          } whitespace-nowrap`}>
            {trend > 0 ? '\u2191' : '\u2193'} {Math.abs(trend)}%
          </span>
          <span className="hidden sm:inline text-[9px] text-slate-500 dark:text-[#b0b5d1] font-bold uppercase tracking-tighter whitespace-nowrap">vs last month</span>
          <span className="sm:hidden text-[9px] text-slate-500 dark:text-[#b0b5d1] font-bold uppercase tracking-tighter whitespace-nowrap">m/m</span>
        </div>
      )}
    </div>
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${ringColor} flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105`}>
      <Icon className={`text-base sm:text-lg ${iconColor}`} />
    </div>
  </div>
);

const DashboardCards = ({ totalIncome, totalExpense, savings }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Balance"   amount={savings}       icon={FaWallet}    ringColor="bg-cyan-500/15" iconColor="text-cyan-700 dark:text-cyan-300" trend={12} />
      <StatCard title="Total Income"    amount={totalIncome}   icon={FaArrowUp}   ringColor="bg-teal-500/15"  iconColor="text-teal-700 dark:text-teal-300"  trend={8}  />
      <StatCard title="Total Expenses"  amount={totalExpense}  icon={FaArrowDown} ringColor="bg-rose-500/12"  iconColor="text-rose-500 dark:text-rose-300" trend={-5} />
      <StatCard title="Net Savings"     amount={savings}       icon={FaPiggyBank} ringColor="bg-sky-500/15"   iconColor="text-sky-700 dark:text-sky-300"   trend={4}  />
    </div>
  );
};

export default DashboardCards;

