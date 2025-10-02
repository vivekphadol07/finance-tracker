import { useSelector } from "react-redux";

export const Insights = () => {
  const transactions = useSelector(state => state.transactions.items);
  const expenses = transactions.filter(t => t.type === 'expense');

  if (!expenses.length)
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow text-gray-500">
        No expense data yet.
      </div>
    );

  const byCategory = {};
  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.convertedBase;
  });

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const [topCat, topAmt] = sorted[0];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow space-y-2">
      <div className="text-gray-800 dark:text-gray-200 font-medium">
        Top spending category:
        <span className="ml-1 font-bold">{topCat}</span>
        <span className="ml-1 text-green-600">(${topAmt.toFixed(2)})</span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Suggestion: Try reducing <span className="font-semibold">{topCat}</span> spend by 10% next month.
      </div>
    </div>
  );
};

export default Insights;
