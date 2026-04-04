import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMonthlyBudget, updateCategoryBudget } from '../redux/Slices/budgetsSlice';
import { selectTransactions } from '../redux/Slices/transactionsSlice';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';

export const BudgetManager = () => {
  const dispatch = useDispatch();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('food');
  const [categoryBudget, setCategoryBudget] = useState('');

  const budgets = useSelector((s) => s.budgets.monthlyGoals);
  const transactions = useSelector(selectTransactions);
  const categoryItems = useSelector((s) => s.categories?.items || []);
  const role = useSelector((state) => state.ui?.role || 'Admin');

  const expenseCategories = useMemo(() => {
    const fromTransactions = transactions
      .filter((t) => t.type === 'expense')
      .map((t) => (t.category || '').toLowerCase().trim())
      .filter(Boolean);

    const fromStore = categoryItems
      .map((c) => (c || '').toLowerCase().trim())
      .filter(Boolean)
      .filter((c) => !['salary', 'freelance', 'investment', 'gift'].includes(c));

    const merged = Array.from(new Set([...fromTransactions, ...fromStore]));
    return merged.length ? merged : ['food', 'rent', 'travel', 'shopping', 'utilities', 'other'];
  }, [transactions, categoryItems]);

  useEffect(() => {
    if (!expenseCategories.includes(category)) {
      setCategory(expenseCategories[0]);
    }
  }, [expenseCategories, category]);

  const getSpentForMonth = useCallback(
    (monthKey) =>
      transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + (t.convertedBase || t.amount), 0),
    [transactions]
  );

  const getCategorySpentForMonth = useCallback(
    (monthKey, categoryName) =>
      transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.date.startsWith(monthKey) &&
            (t.category || '').toLowerCase() === categoryName.toLowerCase()
        )
        .reduce((sum, t) => sum + (t.convertedBase || t.amount), 0),
    [transactions]
  );

  function handleSetTotalBudget() {
    if (!budget || Number(budget) <= 0) return toast.error('Enter valid total budget');
    dispatch(setMonthlyBudget({ monthKey: month, totalBudget: Number(budget) }));
    setBudget('');
    toast.success('Monthly total budget updated');
  }

  function handleSetCategoryBudget() {
    if (!category) return toast.error('Select category');
    if (!categoryBudget || Number(categoryBudget) <= 0) return toast.error('Enter valid category budget');

    dispatch(
      updateCategoryBudget({
        monthKey: month,
        category,
        amount: Number(categoryBudget)
      })
    );
    setCategoryBudget('');
    toast.success(`Budget set for ${category}`);
  }

  useEffect(() => {
    Object.entries(budgets).forEach(([key, v]) => {
      const spent = getSpentForMonth(key);
      const totalBudget = Number(v.totalBudget || 0);
      if (totalBudget > 0) {
        const ratio = spent / totalBudget;
        const percent = Math.round(ratio * 100);
        if (ratio >= 0.9 && ratio < 1) {
          toast.warning(`You are at ${percent}% of your total budget for ${key}!`, { id: `warn-total-${key}` });
        } else if (ratio >= 1) {
          toast.error(`You have exceeded your total budget for ${key}!`, { id: `error-total-${key}` });
        }
      }

      Object.entries(v.categories || {}).forEach(([cat, limit]) => {
        const limitAmount = Number(limit || 0);
        if (limitAmount <= 0) return;

        const catSpent = getCategorySpentForMonth(key, cat);
        const catRatio = catSpent / limitAmount;
        const catPercent = Math.round(catRatio * 100);

        if (catRatio >= 0.9 && catRatio < 1) {
          toast.warning(`${cat} is at ${catPercent}% of budget for ${key}`, { id: `warn-cat-${key}-${cat}` });
        } else if (catRatio >= 1) {
          toast.error(`${cat} budget exceeded for ${key}`, { id: `error-cat-${key}-${cat}` });
        }
      });
    });
  }, [budgets, getCategorySpentForMonth, getSpentForMonth]);

  const monthlyEntries = Object.entries(budgets).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="flex flex-col gap-5">
      {role === 'Admin' ? (
        <div className="space-y-5 bg-white dark:bg-[#0b0b0e] p-5 rounded-xl border border-slate-200 dark:border-[#1a1a22]">
          <p className="text-[9px] font-black text-slate-500 dark:text-[#bec2dc] uppercase tracking-[0.12em]">Set Monthly Budgets</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Budget Month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            <Input label={'Total Budget (\u20B9)'} type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. 50000" />
          </div>
          <Button onClick={handleSetTotalBudget} className="w-full h-11">Set Total Monthly Budget</Button>

          <div className="pt-2 border-t border-slate-200 dark:border-[#1a1a22] space-y-4">
            <p className="text-[9px] font-black text-slate-500 dark:text-[#bec2dc] uppercase tracking-[0.12em]">Set Category Budget</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-slate-500 dark:text-[#c3c7df] uppercase tracking-[0.12em]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1e1e26] bg-white dark:bg-[#0d0d11] text-sm text-slate-900 dark:text-[#f1f4ff] [color-scheme:light] dark:[color-scheme:dark] focus:outline-none focus:border-brand-accent/40 focus:ring-1 focus:ring-brand-accent/40"
                >
                  {expenseCategories.map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>
              <Input
                label={'Category Budget (\u20B9)'}
                type="number"
                value={categoryBudget}
                onChange={(e) => setCategoryBudget(e.target.value)}
                placeholder="e.g. 12000"
              />
            </div>
            <Button onClick={handleSetCategoryBudget} variant="secondary" className="w-full h-11">Set Category Budget</Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500 dark:text-[#bec2dc] italic bg-white dark:bg-[#0b0b0e] p-3 rounded-xl border border-slate-200 dark:border-[#1a1a22]">
          Log in as Admin to manage monthly and category budgets.
        </p>
      )}

      <div className="space-y-3">
        {monthlyEntries.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-[#a4aac7] text-center py-8 bg-white dark:bg-[#0b0b0e] rounded-xl border border-slate-200 dark:border-[#1a1a22]">
            No budgets set yet.
          </div>
        )}

        {monthlyEntries.map(([k, v]) => {
          const spent = getSpentForMonth(k);
          const totalBudget = Number(v.totalBudget || 0);
          const ratio = totalBudget > 0 ? Math.min(spent / totalBudget, 1) : 0;
          const isExceeded = totalBudget > 0 && spent > totalBudget;
          const isWarning = ratio >= 0.9 && !isExceeded;
          const categoryBudgets = v.categories || {};

          return (
            <div key={k} className="p-4 rounded-xl border border-slate-200 dark:border-[#1a1a22] bg-white dark:bg-[#0b0b0e] space-y-4">
              <div className="flex flex-wrap justify-between items-end gap-2 mb-1">
                <span className="text-sm font-bold text-slate-700 dark:text-[#e0e4ff]">{k}</span>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className={`font-black ${isExceeded ? 'text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                    {`\u20B9${spent.toFixed(0)}`}
                  </span>
                  <span className="text-slate-400 dark:text-[#9ca1c3]">/</span>
                  <span className="text-slate-500 dark:text-[#c1c6e2]">{`\u20B9${totalBudget}`}</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-[#111116] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-brand-accent'
                  }`}
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <span className="text-[9px] text-slate-500 dark:text-[#aab0ce] font-bold uppercase tracking-widest">
                  {Math.round(ratio * 100)}% used
                </span>
                {isExceeded && <span className="text-[9px] text-rose-400 font-black uppercase">Over budget!</span>}
                {isWarning && <span className="text-[9px] text-amber-400 font-black uppercase">Almost there</span>}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#1a1a22] space-y-3">
                <p className="text-[9px] font-black text-slate-500 dark:text-[#bec2dc] uppercase tracking-[0.12em]">Category Budgets</p>

                {Object.keys(categoryBudgets).length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-[#aab0ce]">No category budgets set for this month.</p>
                )}

                {Object.entries(categoryBudgets).map(([cat, limit]) => {
                  const limitAmount = Number(limit || 0);
                  const catSpent = getCategorySpentForMonth(k, cat);
                  const catRatio = limitAmount > 0 ? Math.min(catSpent / limitAmount, 1) : 0;
                  const catExceeded = limitAmount > 0 && catSpent > limitAmount;

                  return (
                    <div key={`${k}-${cat}`} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold capitalize text-slate-700 dark:text-[#dde2fb]">{cat}</span>
                        <span className={`font-black ${catExceeded ? 'text-rose-400' : 'text-slate-600 dark:text-[#c6cbe7]'}`}>
                          {`\u20B9${catSpent.toFixed(0)} / \u20B9${limitAmount}`}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-[#111116] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${catExceeded ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${catRatio * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager;
