import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMonthlyBudget } from '../redux/Slices/budgetsSlice';

export const BudgetManager = () => {
  const dispatch = useDispatch();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [budget, setBudget] = useState('');
  const budgets = useSelector(s => s.budgets.monthlyGoals);

  function handleSet() {
    if (!budget || Number(budget) <= 0) return alert('Enter valid budget');
    const key = month;
    dispatch(setMonthlyBudget({ monthKey: key, totalBudget: Number(budget) }));
    setBudget('');
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Monthly Budget</h3>

      {/* Input row */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="p-2 border rounded w-full sm:w-36"
        />
        <input
          value={budget}
          onChange={e => setBudget(e.target.value)}
          placeholder="Total budget"
          className="p-2 border rounded flex-1"
        />
        <button
          onClick={handleSet}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full sm:w-auto"
        >
          Set
        </button>
      </div>

      {/* Budgets list */}
      <div className="space-y-2">
        {Object.entries(budgets).length === 0 && (
          <div className="text-sm text-gray-500">No budget set.</div>
        )}

        {Object.entries(budgets).map(([k, v]) => (
          <div
            key={k}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-3 rounded hover:shadow transition"
          >
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">{k}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ${v.totalBudget}
              </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 sm:mt-0">
              {/* Placeholder for spent vs budget */}
              Budget
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetManager;
