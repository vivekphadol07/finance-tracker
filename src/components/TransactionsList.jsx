import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTransaction } from '../redux/Slices/transactionsSlice';

export const TransactionsList = () => {
  const transactions = useSelector(s => s.transactions.items);
  const dispatch = useDispatch();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Transactions</h3>
      <ul className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.length === 0 && (
          <li className="text-sm text-gray-500 dark:text-gray-400">No transactions yet.</li>
        )}

        {transactions.map(t => (
          <li
            key={t.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-3 rounded hover:shadow transition"
          >
            <div className="mb-2 sm:mb-0">
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {t.category} — {t.notes || "No notes"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t.date} • {t.currency} {t.amount} • Converted ${t.convertedBase.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => dispatch(deleteTransaction(t.id))}
              className="px-3 py-1 border rounded text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-700 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsList;
