import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/Slices/uiSlice';
import { selectTransactions } from '../redux/Slices/transactionsSlice';
import { exportTransactionsToCSV } from '../utils/exportUtils';
import Card from '../components/ui/Card';
import { FaSun, FaMoon, FaDownload, FaShieldAlt, FaPalette, FaFileInvoiceDollar, FaUserCircle } from 'react-icons/fa';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { theme, role } = useSelector((state) => state.ui);
  const transactions = useSelector(selectTransactions);

  const handleExport = () => {
    exportTransactionsToCSV(transactions);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7">
          <Card title="Theme Studio">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-accent/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FaPalette className="text-sm" />
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white">Pick your display mode</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => dispatch(setTheme('light'))}
                  className={`text-left rounded-2xl border p-4 transition-all ${
                    theme === 'light'
                      ? 'border-brand-accent/40 bg-brand-accent/5 shadow-sm'
                      : 'border-slate-200 dark:border-[#1a1a22] hover:border-slate-300 dark:hover:border-[#252530]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      theme === 'light'
                        ? 'bg-brand-accent/15 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-[#111116] text-slate-500 dark:text-[#cbd0ea]'
                    }`}>
                      <FaSun className="text-lg" />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-500 dark:text-[#b8bedb]">
                      Light
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Bright Workspace</h4>
                  <p className="text-xs mt-1 text-slate-500 dark:text-[#bcc3e1] font-medium">
                    High clarity for daytime tracking and reporting.
                  </p>
                </button>

                <button
                  onClick={() => dispatch(setTheme('dark'))}
                  className={`text-left rounded-2xl border p-4 transition-all ${
                    theme === 'dark'
                      ? 'border-brand-accent/40 bg-brand-accent/5 shadow-sm'
                      : 'border-slate-200 dark:border-[#1a1a22] hover:border-slate-300 dark:hover:border-[#252530]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      theme === 'dark'
                        ? 'bg-brand-accent/15 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-[#111116] text-slate-500 dark:text-[#cbd0ea]'
                    }`}>
                      <FaMoon className="text-lg" />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-500 dark:text-[#b8bedb]">
                      Dark
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Night Workspace</h4>
                  <p className="text-xs mt-1 text-slate-500 dark:text-[#bcc3e1] font-medium">
                    Reduced glare for focused evening analysis.
                  </p>
                </button>
              </div>
            </div>
          </Card>
        </div>

        <div className="xl:col-span-5">
          <Card title="Data Export">
            <div className="h-full flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FaFileInvoiceDollar className="text-lg" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">Financial Report</h4>
                  <p className="text-xs text-slate-500 dark:text-[#bec2dc] font-medium leading-relaxed mt-1.5">
                    Export your complete transaction history to a CSV file compatible with Excel and Sheets.
                  </p>
                </div>
              </div>

              <button
                onClick={handleExport}
                className="w-full px-6 py-3.5 bg-blue-500/10 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-black text-sm rounded-xl border border-blue-500/20 transition-all flex items-center justify-center gap-2.5 active:scale-95"
              >
                <FaDownload className="text-sm" />
                Download CSV Report
              </button>
            </div>
          </Card>
        </div>
      </div>

      <Card title="Account & Access">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 bg-brand-accent/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl font-black border border-brand-accent/15">
              <FaUserCircle />
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">Vivek</h4>
              <p className="text-xs text-slate-500 dark:text-[#bcc2df] font-medium mt-1">
                Finance workspace owner
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-[#111116] text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 rounded-lg flex items-center gap-1.5 border border-slate-200 dark:border-[#1a1a22]">
                  <FaShieldAlt className="text-[8px]" /> {role} Role
                </span>
                <span className="text-[9px] text-slate-400 dark:text-[#a4aac7] font-bold uppercase tracking-widest">
                  ID: FIN-4829
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1a1a22] bg-slate-50 dark:bg-[#0d0d11]">
              <p className="text-[9px] uppercase tracking-widest font-black text-slate-500 dark:text-[#b6bcda]">Mode</p>
              <p className="text-sm mt-1 font-black text-slate-900 dark:text-white capitalize">{theme}</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1a1a22] bg-slate-50 dark:bg-[#0d0d11]">
              <p className="text-[9px] uppercase tracking-widest font-black text-slate-500 dark:text-[#b6bcda]">Role</p>
              <p className="text-sm mt-1 font-black text-slate-900 dark:text-white capitalize">{role}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
