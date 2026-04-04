import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../redux/Slices/transactionsSlice';
import { FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'sonner';

const inputCls = `w-full p-3 bg-white dark:bg-[#0d0d11] border border-slate-200 dark:border-[#1e1e26] rounded-xl text-sm text-slate-900 dark:text-[#f1f4ff]
  placeholder-slate-400 dark:placeholder-[#8a8fae] focus:outline-none focus:border-brand-accent/40 focus:ring-1
  focus:ring-brand-accent/20 transition-colors`;

const labelCls = 'block text-[9px] font-black text-slate-500 dark:text-[#c2c7e3] uppercase tracking-[0.12em] mb-1.5';

const TransactionForm = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.ui?.role || 'Admin');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const categories = {
    expense: ['food', 'travel', 'rent', 'shopping', 'healthcare', 'utilities', 'other'],
    income: ['salary', 'freelance', 'investment', 'gift', 'other']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role !== 'Admin') {
      toast.error('Only Admin can add transactions');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    dispatch(addTransaction({
      ...formData,
      amount: Number(formData.amount),
      convertedBase: Number(formData.amount)
    }));
    toast.success('Transaction added successfully');
    setFormData((prev) => ({ ...prev, amount: '', note: '' }));
  };

  return (
    <div className="space-y-4">
      {role !== 'Admin' && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#1a1a22] bg-slate-50 dark:bg-[#0b0b0e] text-sm text-slate-600 dark:text-[#cbd0ea] font-medium">
          Viewer role cannot add transactions. Switch to Admin mode to create a new record.
        </div>
      )}

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        disabled={role !== 'Admin'}
        className={`w-full flex items-center justify-between p-3 rounded-xl text-blue-600 dark:text-blue-400 font-bold text-sm transition-all border border-brand-accent/15 ${
          role !== 'Admin'
            ? 'bg-slate-100 dark:bg-[#111116] cursor-not-allowed opacity-60'
            : 'bg-brand-accent/8 hover:bg-brand-accent/12'
        }`}
      >
        <span className="flex items-center gap-2">
          <FaPlus className="text-xs" />
          {isCollapsed ? 'Add New Record' : 'Close Form'}
        </span>
        {isCollapsed ? <FaChevronDown className="text-xs" /> : <FaChevronUp className="text-xs" />}
      </button>

      {!isCollapsed && role === 'Admin' && (
        <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-white dark:bg-[#0b0b0e] rounded-xl border border-slate-200 dark:border-[#1a1a22] animate-fade-in-up">
          {/* Type Toggle */}
          <div className="flex bg-slate-50 dark:bg-[#0e0e12] p-1 rounded-xl border border-slate-200 dark:border-[#1a1a22]">
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, type: 'expense', category: 'food' }))}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                formData.type === 'expense'
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  : 'text-slate-500 dark:text-[#c8ccef] hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, type: 'income', category: 'salary' }))}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                formData.type === 'income'
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 dark:text-[#c8ccef] hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Amount ({'\u20B9'})</label>
              <input
                type="number"
                placeholder="0.00"
                className={inputCls}
                value={formData.amount}
                onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
              />
            </div>

            <div>
              <label className={labelCls}>Category</label>
              <select
                className={`${inputCls} capitalize [color-scheme:light] dark:[color-scheme:dark]`}
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              >
                {categories[formData.type].map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-[#0d0d11]">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Date</label>
              <input
                type="date"
                className={`${inputCls} [color-scheme:light] dark:[color-scheme:dark]`}
                value={formData.date}
                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
              />
            </div>

            <div>
              <label className={labelCls}>Note</label>
              <input
                type="text"
                placeholder="Add a remark..."
                className={inputCls}
                value={formData.note}
                onChange={(e) => setFormData((p) => ({ ...p, note: e.target.value }))}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3.5 bg-brand-accent text-[#050507] font-black rounded-xl shadow-lg shadow-brand-accent/10 hover:brightness-110 transition-all active:scale-[0.98] text-sm"
          >
            Confirm Transaction
          </button>
        </form>
      )}
    </div>
  );
};

export default TransactionForm;
