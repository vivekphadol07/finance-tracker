import { useSelector } from "react-redux";
import { selectTransactions } from '../redux/Slices/transactionsSlice';
import { FaLightbulb } from "react-icons/fa";

export const Insights = () => {
  const transactions = useSelector(selectTransactions);
  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes  = transactions.filter(t => t.type === 'income');

  const totalExpense = expenses.reduce((s, t) => s + (t.convertedBase || 0), 0);
  const totalIncome  = incomes.reduce((s, t)  => s + (t.convertedBase || 0), 0);
  const savingsRate  = totalIncome > 0
    ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
    : 0;

  if (!expenses.length && !incomes.length)
    return (
      <div className="p-6 bg-white dark:bg-[#0e0e12] rounded-2xl border border-slate-200 dark:border-[#1a1a22] text-slate-500 dark:text-[#bec2dc] text-sm font-medium">
        Add some transactions to see smart insights here.
      </div>
    );

  const byCategory = {};
  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + (e.convertedBase || 0);
  });
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const topCat = sorted[0]?.[0] ?? null;
  const topAmt = sorted[0]?.[1] ?? 0;

  return (
    <div className="bg-white dark:bg-[#0e0e12] border border-slate-200 dark:border-[#1a1a22] rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center">
          <FaLightbulb className="text-amber-400 text-sm" />
        </div>
        <span className="text-[9px] font-black text-slate-500 dark:text-[#bec2dc] uppercase tracking-[0.12em]">Smart Insights</span>
      </div>

      {topCat && (
        <div className="p-4 bg-slate-50 dark:bg-[#0b0b0e] rounded-xl border border-slate-200 dark:border-[#1a1a22]">
          <div className="text-sm font-semibold text-slate-700 dark:text-[#e0e4ff]">
            Top category:{" "}
            <span className="font-black text-rose-400 uppercase tracking-wide">{topCat}</span>
            {' - '}<span className="font-black text-slate-900 dark:text-white">{`\u20B9${topAmt.toLocaleString()}`}</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-[#bec2dc] mt-1.5 font-bold uppercase tracking-wider">
            Suggestion: Try reducing {topCat} spend by 10% next month.
          </p>
        </div>
      )}

      <div className="p-4 bg-slate-50 dark:bg-[#0b0b0e] rounded-xl border border-slate-200 dark:border-[#1a1a22]">
        <div className="text-sm font-semibold text-slate-700 dark:text-[#e0e4ff]">
          Savings rate:{" "}
          <span className={`font-black ${Number(savingsRate) >= 20 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-400'}`}>
            {savingsRate}%
          </span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-[#bec2dc] mt-1.5 font-bold uppercase tracking-wider">
          {Number(savingsRate) >= 20
            ? 'Great job! You are saving a healthy amount.'
            : 'Aim to save at least 20% of your income.'}
        </p>
      </div>
    </div>
  );
};

export default Insights;

