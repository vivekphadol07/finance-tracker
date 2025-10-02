import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4ade80', '#60a5fa', '#fca5a5', '#f59e0b', '#a78bfa', '#fb7185'];

export const SpendingChart = () => {
  const transactions = useSelector(state => state.transactions.items);
  const expenses = transactions.filter(t => t.type === 'expense');

  const byCategory = {};
  expenses.forEach(e => {
    const category = e.category || "Uncategorized";
    byCategory[category] = (byCategory[category] || 0) + (e.convertedBase || 0);
  });

  const data = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  if (!data.length) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow text-gray-500 text-center">
        No expense data to show.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;
