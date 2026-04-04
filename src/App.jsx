import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import { Toaster } from 'sonner';
import './index.css';

const MainApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, activeTab } = useSelector((state) => state.ui);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleSidebarNavigate = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionsPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${theme === 'dark' ? 'app-bg-dark text-[#eef4ff]' : 'app-bg-light text-slate-900'} w-full overflow-x-hidden`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} onNavigate={handleSidebarNavigate} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-3 sm:p-4 md:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Provider store={store}>
      <Toaster position="top-right" richColors closeButton />
      <MainApp />
    </Provider>
  );
};

export default App;
