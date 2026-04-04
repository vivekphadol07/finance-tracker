import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTransactions } from '../redux/Slices/transactionsSlice';
import { setActiveTab } from '../redux/Slices/uiSlice';
import SpendingChart from '../components/dashboard/SpendingChart';
import DashboardCards from '../components/dashboard/DashboardCards';
import Card from '../components/ui/Card';
import { FaArrowRight, FaHistory } from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + (t.convertedBase || t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + (t.convertedBase || t.amount || 0), 0);

  const savings = totalIncome - totalExpense;
  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="w-full space-y-6 animate-fade-in-up pb-24 max-w-[1600px] mx-auto">
      {/* Stat Cards */}
      <DashboardCards totalIncome={totalIncome} totalExpense={totalExpense} savings={savings} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Monthly Cash Flow" className="h-[340px] sm:h-[380px]">
          <SpendingChart type="line" />
        </Card>
        <Card title="Spending Breakdown" className="h-[340px] sm:h-[380px]">
          <SpendingChart type="pie" />
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card 
        title="Recent Activity" 
        headerAction={
          <button 
            onClick={() => dispatch(setActiveTab('transactions'))}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-600/70 dark:hover:text-blue-400/70 text-[11px] font-bold flex items-center gap-1.5 transition-all group"
          >
            View All <FaArrowRight className="group-hover:translate-x-0.5 transition-transform text-[9px]" />
          </button>
        }
      >
        <div className="divide-y divide-slate-100 dark:divide-[#111116]">
          {recentTransactions.map((t) => (
            <div key={t.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                  t.type === 'income' 
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                    : 'bg-rose-500/10 text-rose-400'
                }`}>
                  <FaHistory />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-[#f1f4ff] leading-none mb-1 truncate">{t.note || 'No description'}</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#111116] text-[9px] font-black uppercase text-slate-500 dark:text-[#bac0db] tracking-wider border border-slate-200 dark:border-[#1a1a22]">
                      {t.category}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-[#9da3c4] font-medium">
                      {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`text-sm sm:text-base font-black tabular-nums shrink-0 self-start sm:self-auto ${
                t.type === 'income' ? 'text-blue-600 dark:text-blue-400' : 'text-rose-400'
              }`}>
                {`${t.type === 'income' ? '+' : '-'}\u20B9${Math.abs(t.amount).toLocaleString()}`}
              </div>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-[#a6acc8] italic text-sm">
              Your transaction history is empty. Start by adding a record!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

