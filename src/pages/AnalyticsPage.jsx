import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTransactions } from '../redux/Slices/transactionsSlice';
import { setActiveTab } from '../redux/Slices/uiSlice';
import SpendingChart from '../components/dashboard/SpendingChart';
import Card from '../components/ui/Card';
import { Insights } from './Insights';
import { FaArrowUp, FaArrowDown, FaTrophy, FaLightbulb, FaPlusCircle } from 'react-icons/fa';

const StatMini = ({ icon: Icon, label, value, iconClass, bgClass }) => (
  <div className="bg-white/85 dark:bg-[#0e172b]/78 border border-slate-200/80 dark:border-[#20324b] rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:border-cyan-200 dark:hover:border-cyan-300/30 shadow-[0_10px_28px_rgba(15,23,42,0.07)] dark:shadow-[0_14px_30px_rgba(2,6,23,0.4)] backdrop-blur-xl">
    <div className={`w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center`}>
      <Icon className={`text-base ${iconClass}`} />
    </div>
    <span className="text-[9px] font-black text-slate-500 dark:text-[#bcc0da] uppercase tracking-[0.12em]">{label}</span>
    <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{value}</span>
  </div>
);

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');

  const totalExpense = expenses.reduce((s, t) => s + (t.convertedBase || 0), 0);
  const totalIncome = incomes.reduce((s, t) => s + (t.convertedBase || 0), 0);
  const netSavings = totalIncome - totalExpense;

  const budgets = useSelector(s => s.budgets.monthlyGoals);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyGoal = budgets[currentMonth]?.totalBudget || 0;
  const monthlySpent = expenses
    .filter(t => t.date.startsWith(currentMonth))
    .reduce((s, t) => s + (t.convertedBase || 0), 0);
  
  const budgetRatio = monthlyGoal > 0 ? Math.min(monthlySpent / monthlyGoal, 1) : 0;
  const budgetPercent = Math.round(budgetRatio * 100);
  const isOverBudget = monthlySpent > monthlyGoal && monthlyGoal > 0;

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMini icon={FaArrowUp}    label="Total Income"    value={`\u20B9${totalIncome.toLocaleString()}`} iconClass="text-teal-700 dark:text-teal-300" bgClass="bg-teal-500/15" />
        <StatMini icon={FaArrowDown}  label="Total Expenses"  value={`\u20B9${totalExpense.toLocaleString()}`} iconClass="text-rose-500 dark:text-rose-300" bgClass="bg-rose-500/12" />
        <StatMini icon={FaTrophy}     label="Net Savings"     value={`\u20B9${netSavings.toLocaleString()}`} iconClass="text-cyan-700 dark:text-cyan-300" bgClass="bg-brand-accent/14" />
        <StatMini icon={FaLightbulb}  label="Savings Growth"  value="+12.4%" iconClass="text-sky-700 dark:text-sky-300" bgClass="bg-sky-500/15" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[480px]">
        <div className="lg:col-span-8 lg:h-full">
          <Card title="Revenue vs Expenses Trend" className="h-full">
            <div className="h-[280px] sm:h-[380px] w-full">
              <SpendingChart type="line" />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-4 lg:h-full">
          <Card title="Top Spending Distribution" className="h-full">
            <div className="h-[280px] sm:h-[380px] w-full">
              <SpendingChart type="pie" />
            </div>
          </Card>
        </div>
      </div>

      {/* Insights + Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Insights />
        </div>
        <div className="lg:col-span-1">
          <Card title="Budget Health">
            <div className="space-y-5">
              <div className="flex flex-wrap justify-between items-end gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-[#bec2dc]">Monthly Limit</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {monthlyGoal > 0 ? `\u20B9${monthlyGoal.toLocaleString()}` : 'No limit set'}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-[#111116] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isOverBudget ? 'bg-rose-500' : 'bg-brand-accent'}`}
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 dark:text-[#bec2dc] uppercase tracking-widest">
                  {`\u20B9${monthlySpent.toLocaleString()} spent`}
                </span>
                <span className={`text-xs font-black uppercase tracking-widest ${isOverBudget ? 'text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {budgetPercent}% used
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Category + Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-10">
        <div className="lg:col-span-2">
          <Card title="Monthly Category Analysis">
            <div className="space-y-5">
              {['Food', 'Rent', 'Travel', 'Shopping'].map((cat, i) => {
                const pct = [38, 62, 24, 51][i];
                return (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-[#bec2dc] uppercase tracking-widest">
                      <span>{cat}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-[#111116] rounded-full overflow-hidden">
                      <div className="h-full bg-brand-accent rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card title="Quick Action">
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-[#bcc0da] leading-relaxed font-medium">
                Need to record a new expense? Head over to the transactions page for the full entry form.
              </p>
              <button 
                onClick={() => dispatch(setActiveTab('transactions'))}
                className="w-full p-3.5 bg-brand-accent text-[#050507] font-black text-sm rounded-xl shadow-lg shadow-brand-accent/10 hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5"
              >
                <FaPlusCircle className="text-base" />
                Add New Transaction
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

