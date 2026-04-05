import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBill, deleteBill, toggleBillPaid } from '../../redux/Slices/billsSlice';
import { toast } from 'sonner';
import { FaBell, FaPlusCircle, FaTrash } from 'react-icons/fa';

const BillsManager = () => {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills?.items || []);
  const role = useSelector((state) => state.ui?.role || 'Admin');

  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDueDate, setBillDueDate] = useState('');

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const getDayDiff = useCallback(
    (dateValue) => {
      const due = new Date(dateValue);
      due.setHours(0, 0, 0, 0);
      return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    },
    [today]
  );

  useEffect(() => {
    bills.forEach((bill) => {
      if (bill.paid) return;
      if (!bill.dueDate) return;

      const daysLeft = getDayDiff(bill.dueDate);
      if (daysLeft < 0) {
        toast.error(`${bill.name} is overdue by ${Math.abs(daysLeft)} day(s)`, {
          id: `bill-overdue-${bill.id}`
        });
      } else if (daysLeft <= 3) {
        toast.warning(
          `${bill.name} is due ${daysLeft === 0 ? 'today' : `in ${daysLeft} day(s)`}`,
          { id: `bill-due-${bill.id}` }
        );
      }
    });
  }, [bills, getDayDiff]);

  const handleAddBill = () => {
    if (role !== 'Admin') {
      toast.error('Only Admin can add bills');
      return;
    }
    if (!billName.trim()) return toast.error('Enter bill name');
    if (!billAmount || Number(billAmount) <= 0) return toast.error('Enter valid amount');
    if (!billDueDate) return toast.error('Select due date');

    dispatch(addBill({ name: billName, amount: billAmount, dueDate: billDueDate }));
    toast.success('Bill added');
    setBillName('');
    setBillAmount('');
    setBillDueDate('');
  };

  const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="space-y-5">
      {role !== 'Admin' && (
        <p className="text-xs text-slate-500 dark:text-[#bec2dc] italic bg-slate-50 dark:bg-[#0b0b0e] p-3 rounded-xl border border-slate-200 dark:border-[#1a1a22]">
          Viewer role can view bills and reminders, but cannot add or modify bills.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <input
          type="text"
          value={billName}
          onChange={(e) => setBillName(e.target.value)}
          placeholder="Bill name (e.g. Rent)"
          disabled={role !== 'Admin'}
          className="md:col-span-5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#1e1e26] bg-white dark:bg-[#0d0d11] text-sm text-slate-900 dark:text-[#f1f4ff] placeholder-slate-400 dark:placeholder-[#8a8fae] focus:outline-none focus:border-brand-accent/40 focus:ring-1 focus:ring-brand-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <input
          type="number"
          value={billAmount}
          onChange={(e) => setBillAmount(e.target.value)}
          placeholder="Amount"
          disabled={role !== 'Admin'}
          className="md:col-span-3 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#1e1e26] bg-white dark:bg-[#0d0d11] text-sm text-slate-900 dark:text-[#f1f4ff] placeholder-slate-400 dark:placeholder-[#8a8fae] focus:outline-none focus:border-brand-accent/40 focus:ring-1 focus:ring-brand-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <input
          type="date"
          value={billDueDate}
          onChange={(e) => setBillDueDate(e.target.value)}
          disabled={role !== 'Admin'}
          aria-label="Due date"
          title="Due date"
          className="md:col-span-4 min-w-[10.5rem] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#1e1e26] bg-white dark:bg-[#0d0d11] text-sm text-slate-900 dark:text-[#f1f4ff] [color-scheme:light] dark:[color-scheme:dark] focus:outline-none focus:border-brand-accent/40 focus:ring-1 focus:ring-brand-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>

      <button
        type="button"
        onClick={handleAddBill}
        disabled={role !== 'Admin'}
        className={`w-full p-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 border transition-all ${
          role !== 'Admin'
            ? 'bg-slate-100 dark:bg-[#111116] text-slate-500 dark:text-[#9ca2c4] border-slate-200 dark:border-[#1a1a22] cursor-not-allowed'
            : 'bg-brand-accent/10 text-blue-600 dark:text-blue-400 border-brand-accent/25 hover:bg-brand-accent/15'
        }`}
      >
        <FaPlusCircle />
        Add Bill
      </button>

      <div className="space-y-3">
        {sortedBills.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-[#a4aac7] text-center py-8 bg-slate-50 dark:bg-[#0b0b0e] rounded-xl border border-slate-200 dark:border-[#1a1a22]">
            No bills added yet.
          </div>
        )}

        {sortedBills.map((bill) => {
          const daysLeft = getDayDiff(bill.dueDate);
          const statusText = bill.paid
            ? 'Paid'
            : daysLeft < 0
              ? `Overdue by ${Math.abs(daysLeft)} day(s)`
              : daysLeft === 0
                ? 'Due today'
                : daysLeft <= 3
                  ? `Due in ${daysLeft} day(s)`
                  : 'Upcoming';

          const statusClass = bill.paid
            ? 'bg-emerald-500/10 text-emerald-500'
            : daysLeft < 0
              ? 'bg-rose-500/10 text-rose-400'
              : daysLeft <= 3
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400';

          return (
            <div key={bill.id} className="p-4 rounded-xl border border-slate-200 dark:border-[#1a1a22] bg-white dark:bg-[#0b0b0e]">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 dark:text-[#f1f4ff] truncate">{bill.name}</p>
                  <p className="text-xs text-slate-500 dark:text-[#bcc0da] mt-0.5">
                    {`\u20B9${Number(bill.amount || 0).toLocaleString()} - Due ${new Date(bill.dueDate).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:shrink-0">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${statusClass}`}>
                    {statusText}
                  </span>
                  {role === 'Admin' && (
                    <>
                      <button
                        type="button"
                        onClick={() => dispatch(toggleBillPaid(bill.id))}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-black border border-slate-200 dark:border-[#1a1a22] text-slate-700 dark:text-[#dbe0fa] hover:bg-slate-100 dark:hover:bg-[#111116]"
                      >
                        {bill.paid ? 'Mark Unpaid' : 'Mark Paid'}
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch(deleteBill(bill.id))}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <FaTrash size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#aab0ce] font-medium">
        <FaBell className="text-blue-600 dark:text-blue-400" />
        Reminder rules: unpaid bills due in 3 days (or overdue) are highlighted and notified.
      </div>
    </div>
  );
};

export default BillsManager;
