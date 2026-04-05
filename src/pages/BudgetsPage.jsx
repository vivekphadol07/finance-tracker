import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import BudgetManager from './BudgetManager';
import Card from '../components/ui/Card';
import BillsManager from '../components/bills/BillsManager';

const BudgetsPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in-up pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-[#0e0e12] p-5 rounded-2xl border border-slate-200 dark:border-[#1a1a22]">
          <p className="text-[9px] text-slate-500 dark:text-[#bac0db] font-black uppercase tracking-[0.14em] mb-2">
            Budget Control Center
          </p>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            Budget smarter. Pay on time. Stay in control.
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#cbd0ea] font-medium mt-2.5 max-w-2xl leading-relaxed">
            Your monthly money command center for goals, limits, and bill reminders.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0e0e12] p-5 rounded-2xl border border-brand-accent/15 dark:border-brand-accent/10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-brand-accent/10 rounded-lg flex items-center justify-center">
              <FaTrophy className="text-blue-600 dark:text-blue-400 text-sm" />
            </div>
            <h4 className="text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-wider">Goal Tracking</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#cbd0ea] font-medium leading-relaxed">
            Keep your expenses below the set limits to receive a "Savvy Spender" badge!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <Card title="Budget Planning & Goals">
            <BudgetManager />
          </Card>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <Card title="Bills & Due Date Reminders">
            <BillsManager />
          </Card>

          <div className="bg-white dark:bg-[#0e0e12] p-5 rounded-2xl border border-slate-200 dark:border-[#1a1a22]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-black">{'\u2191'}</span>
              </div>
              <h4 className="text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-wider">Smart Savings Advice</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#cbd0ea] font-medium leading-relaxed">
              You can save up to 15% more if you reduce your dining expenses this month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetsPage;
