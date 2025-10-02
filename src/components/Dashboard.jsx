import React from 'react';
import TransactionsList from './TransactionsList';
import SpendingChart from './SpendingChart';
import BudgetManager from './BudgetManager';
import { useSelector } from 'react-redux';
import TransactionForm from './TransactionForm';
import { Insights } from './Insights';

export const Dashboard = ({ rates, error, loadingRates }) => {
  const transactions = useSelector(state => state.transactions.items) || [];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + (t.convertedBase || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + (t.convertedBase || 0), 0);

  const savings = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side */}
      <div className="lg:col-span-2 space-y-6">

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow">
          <BudgetManager />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow">
          <TransactionForm rates={rates} error={error} loadingRates={loadingRates} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold">Summary</h2>
            <div className="text-right text-sm sm:text-base">
              <div>Total Income: <span className="font-bold">${totalIncome.toFixed(2)}</span></div>
              <div>Total Expense: <span className="font-bold text-red-600">${totalExpense.toFixed(2)}</span></div>
              <div>Savings: <span className="font-bold text-green-600">${savings.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="mt-4">
            <SpendingChart />
          </div>
        </div>

      </div>

      {/* Right side */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow max-h-96 overflow-y-auto">
          <TransactionsList />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Expense Insights</h3>
          <Insights />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
