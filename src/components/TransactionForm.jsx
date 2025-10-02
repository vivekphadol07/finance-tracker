import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../redux/Slices/transactionsSlice';

export const TransactionForm = ({ rates, error, loadingRates }) => {
  const BASE = "USD";
  const dispatch = useDispatch();
  const categories = useSelector(s => s.categories.items);

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    currency: 'USD',
    category: categories[0] || 'others',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) return alert('Enter a valid amount');

    let convertedBase = amount;

    if (rates?.conversion_rates) {
      const rate = rates.conversion_rates[form.currency];

      if (rate) {
        if (form.currency === BASE) {
          convertedBase = amount;
        } else {
          convertedBase = amount * rate;
        }
      } else {
        console.warn(`Rate not found for ${form.currency}`);
      }
    }

    dispatch(
      addTransaction({
        type: form.type,
        amount,
        currency: form.currency,
        convertedBase: Number(convertedBase.toFixed(2)),
        category: form.category,
        date: form.date,
        notes: form.notes,
      })
    );

    setForm({ ...form, amount: '', notes: '' });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4"
    >
      {/* Row 1 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="p-2 border rounded w-full sm:w-32"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="Amount"
          className="p-2 border rounded flex-1"
        />

        <select
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
          className="p-2 border rounded w-full sm:w-28"
        >
          <option>USD</option>
          <option>INR</option>
          <option>EUR</option>
          <option>GBP</option>
          <option>JPY</option>
        </select>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="p-2 border rounded flex-1"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="p-2 border rounded w-full sm:w-40"
        />
      </div>

      {/* Notes */}
      <textarea
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        placeholder="Notes (optional)"
        className="p-2 border rounded w-full"
        rows={2}
      />

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <button
          disabled={loadingRates}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loadingRates ? 'Loading rates...' : 'Add Transaction'}
        </button>
        {error && (
          <div className="text-sm text-red-600">
            Rate fetch failed. Offline mode used.
          </div>
        )}
      </div>
    </form>
  );
};

export default TransactionForm;
