import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTransactions, deleteTransaction, editTransaction, undo } from '../../redux/Slices/transactionsSlice';
import { FaTrash, FaSearch, FaFilter, FaCalendarAlt, FaEdit, FaCheck, FaTimes, FaDownload, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { exportTransactionsToCSV } from '../../utils/exportUtils';
import { toast } from 'sonner';

const TransactionsList = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const role = useSelector((state) => state.ui?.role || 'Admin');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [datePreset, setDatePreset] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: '',
    note: ''
  });

  const normalizeDate = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const filtered = transactions.filter((t) => {
    const txNote = (t.note || t.notes || '').toLowerCase();
    const txCategory = (t.category || '').toLowerCase();

    const matchesSearch =
      txNote.includes(searchTerm.toLowerCase()) || txCategory.includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;

    const txDate = normalizeDate(t.date);
    if (!txDate) return false;

    const today = normalizeDate(new Date());
    let startDate = null;
    let endDate = null;

    if (datePreset === 'today') {
      startDate = today;
      endDate = today;
    } else if (datePreset === '7d') {
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 6);
      endDate = today;
    } else if (datePreset === '30d') {
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 29);
      endDate = today;
    } else if (datePreset === 'month') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (datePreset === 'custom') {
      startDate = fromDate ? normalizeDate(fromDate) : null;
      endDate = toDate ? normalizeDate(toDate) : null;
    }

    const matchesStart = !startDate || txDate >= startDate;
    const matchesEnd = !endDate || txDate <= endDate;

    return matchesSearch && matchesFilter && matchesStart && matchesEnd;
  });

  const sortedFiltered = [...filtered].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    if (timeA !== timeB) return timeB - timeA;
    return String(b.id).localeCompare(String(a.id));
  });

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditForm({
      type: t.type || 'expense',
      amount: String(t.convertedBase || t.amount || ''),
      category: t.category || 'other',
      date: t.date || new Date().toISOString().split('T')[0],
      note: t.note || t.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ type: 'expense', amount: '', category: '', date: '', note: '' });
  };

  const saveEdit = () => {
    if (role !== 'Admin') return toast.error('Only Admin can edit transactions');
    if (!editingId) return;

    const amountNumber = Number(editForm.amount);
    if (!amountNumber || amountNumber <= 0) return toast.error('Enter valid amount');
    if (!editForm.date) return toast.error('Date is required');

    dispatch(
      editTransaction({
        id: editingId,
        changes: {
          type: editForm.type,
          amount: amountNumber,
          convertedBase: amountNumber,
          category: (editForm.category || 'other').trim().toLowerCase(),
          date: editForm.date,
          note: editForm.note || ''
        }
      })
    );

    toast.success('Transaction updated');
    cancelEdit();
  };

  const handleDelete = (id) => {
    if (role !== 'Admin') return;

    dispatch(deleteTransaction(id));
    toast('Transaction deleted', {
      action: {
        label: 'Undo',
        onClick: () => dispatch(undo())
      }
    });
  };

  const activeFiltersCount = [
    searchTerm.trim().length > 0,
    filterType !== 'all',
    datePreset !== 'all'
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setDatePreset('all');
    setFromDate('');
    setToDate('');
  };

  const handleDownloadFiltered = () => {
    if (!sortedFiltered.length) {
      toast.error('No filtered transactions available to export');
      return;
    }

    const exported = exportTransactionsToCSV(sortedFiltered, {
      filenamePrefix: 'FinaTracker_Filtered_Transactions'
    });

    if (exported) {
      toast.success('Filtered report downloaded');
    }
  };

  const handleDownloadAllHistory = () => {
    if (!transactions.length) {
      toast.error('No transaction history available to export');
      return;
    }

    const exported = exportTransactionsToCSV(transactions, {
      filenamePrefix: 'FinaTracker_All_Transactions'
    });

    if (exported) {
      toast.success('Full transaction history downloaded');
    }
  };

  const controlCls = `py-2 px-3 bg-white dark:bg-[#0d0d11] border border-slate-200 dark:border-[#1e1e26] rounded-xl text-sm text-slate-700 dark:text-[#dfe3ff]
    focus:outline-none focus:border-brand-accent/40 focus:ring-1 focus:ring-brand-accent/20 transition-colors`;

  const headers = role === 'Admin'
    ? ['Date', 'Category', 'Note', 'Amount', '']
    : ['Date', 'Category', 'Note', 'Amount'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#adb3d2]">
          Showing <span className="text-cyan-700 dark:text-cyan-300">{sortedFiltered.length}</span> of {transactions.length} records
        </p>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-cyan-200 dark:border-cyan-400/20 bg-cyan-50 dark:bg-cyan-300/10 text-cyan-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider hover:bg-cyan-100 dark:hover:bg-cyan-300/15 transition-all"
          >
            <FaFilter className="text-[11px]" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-600 text-white text-[10px] leading-none">
                {activeFiltersCount}
              </span>
            )}
            {isFilterOpen ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
          </button>

          <button
            type="button"
            onClick={handleDownloadAllHistory}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1f2b42] bg-white dark:bg-[#111a2d] text-slate-700 dark:text-[#d7ddf5] text-xs font-black uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-[#16233b] transition-all"
          >
            <FaDownload className="text-[11px]" />
            Download
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="space-y-4 p-4 rounded-2xl border border-slate-200 dark:border-[#1a1a22] bg-white/80 dark:bg-[#0b1020]/75 backdrop-blur-xl animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9fa5c6] text-xs" />
              <input
                type="text"
                placeholder="Search note or category..."
                className={`${controlCls} w-full pl-9`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <FaFilter className="text-slate-400 dark:text-[#9fa5c6] text-xs shrink-0" />
              <select
                className={`${controlCls} w-full [color-scheme:light] dark:[color-scheme:dark]`}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all" className="bg-white dark:bg-[#0d0d11]">All Types</option>
                <option value="income" className="bg-white dark:bg-[#0d0d11]">Income</option>
                <option value="expense" className="bg-white dark:bg-[#0d0d11]">Expense</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-slate-400 dark:text-[#9fa5c6] text-xs shrink-0" />
              <select
                className={`${controlCls} w-full [color-scheme:light] dark:[color-scheme:dark]`}
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="date"
                className={`${controlCls} w-full [color-scheme:light] dark:[color-scheme:dark] ${datePreset !== 'custom' ? 'opacity-60 cursor-not-allowed' : ''}`}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                disabled={datePreset !== 'custom'}
                aria-label="From date"
              />
              <input
                type="date"
                className={`${controlCls} w-full [color-scheme:light] dark:[color-scheme:dark] ${datePreset !== 'custom' ? 'opacity-60 cursor-not-allowed' : ''}`}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                disabled={datePreset !== 'custom'}
                aria-label="To date"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                hasActiveFilters
                  ? 'bg-slate-100 dark:bg-[#111116] text-slate-700 dark:text-[#d7dcf5] border-slate-200 dark:border-[#1a1a22] hover:bg-slate-200 dark:hover:bg-[#181822]'
                  : 'bg-slate-100 dark:bg-[#111116] text-slate-400 dark:text-[#8b92b5] border-slate-200 dark:border-[#1a1a22] cursor-not-allowed opacity-70'
              }`}
            >
              Reset Filters
            </button>

            <button
              type="button"
              onClick={handleDownloadFiltered}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-cyan-200 dark:border-cyan-400/25 bg-cyan-50 dark:bg-cyan-300/10 text-cyan-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider hover:bg-cyan-100 dark:hover:bg-cyan-300/15 transition-all"
            >
              <FaDownload className="text-[11px]" />
              Download Filtered Excel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#111116]">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`py-3 px-4 text-[9px] font-black text-slate-500 dark:text-[#b6bbd8] uppercase tracking-[0.12em] ${h === 'Amount' ? 'text-right' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#0e0e12]">
            {sortedFiltered.map((t) => {
              const isEditing = editingId === t.id;
              const amountValue = Math.abs(t.convertedBase || t.amount || 0);

              return (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-[#0d0d11] transition-colors">
                  <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-[#c7ccee] font-medium whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
                        className={`${controlCls} !py-1.5 [color-scheme:light] dark:[color-scheme:dark]`}
                      />
                    ) : (
                      new Date(t.date).toLocaleDateString()
                    )}
                  </td>

                  <td className="py-3.5 px-4 capitalize">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                        className={`${controlCls} !py-1.5`}
                      />
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#111116] border border-slate-200 dark:border-[#1a1a22] text-[9px] font-black text-slate-600 dark:text-[#c7ccee] uppercase tracking-wider">
                        {t.category}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-sm font-medium text-slate-700 dark:text-[#e3e7ff] max-w-[220px]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.note}
                        onChange={(e) => setEditForm((p) => ({ ...p, note: e.target.value }))}
                        className={`${controlCls} !py-1.5 w-full`}
                      />
                    ) : (
                      <span className="truncate block">{t.note || t.notes || 'No description'}</span>
                    )}
                  </td>

                  <td className={`py-3.5 px-4 text-right font-black tabular-nums ${
                    t.type === 'income' ? 'text-blue-600 dark:text-blue-400' : 'text-rose-400'
                  }`}>
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={editForm.type}
                          onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}
                          className={`${controlCls} !py-1.5 [color-scheme:light] dark:[color-scheme:dark]`}
                        >
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) => setEditForm((p) => ({ ...p, amount: e.target.value }))}
                          className={`${controlCls} !py-1.5 w-28 text-right`}
                        />
                      </div>
                    ) : (
                      <span className="text-base">{`${t.type === 'income' ? '+' : '-'}\u20B9${amountValue.toLocaleString()}`}</span>
                    )}
                  </td>

                  {role === 'Admin' && (
                    <td className="py-3.5 px-4 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={saveEdit}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                            title="Save"
                          >
                            <FaCheck size={11} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 text-slate-500 hover:bg-slate-500/10 rounded-lg transition-all"
                            title="Cancel"
                          >
                            <FaTimes size={11} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(t)}
                            className="p-1.5 text-slate-400 dark:text-[#9ca2c4] hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Edit"
                          >
                            <FaEdit size={11} />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1.5 text-slate-400 dark:text-[#9ca2c4] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <FaTrash size={11} />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}

            {sortedFiltered.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="py-14 text-center text-slate-500 dark:text-[#a4aac7] italic text-sm">
                  No records found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsList;
