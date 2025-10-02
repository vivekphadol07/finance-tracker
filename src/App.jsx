import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import './index.css';

export const App = () => {
  const [rates, setRates] = useState(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "d19d30e4f174d7cd09bd232c";
  const BASE = "USD";

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoadingRates(true);
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setRates(data);
      } catch (err) {
        setError('Failed to fetch exchange rates');
        console.log(err);
      } finally {
        setLoadingRates(false);
      }
    };

    fetchRates();
  }, [API_KEY, BASE]);

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
        <Navbar />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loadingRates ? (
            <p className="text-center text-gray-700 dark:text-gray-200">Loading exchange rates...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <Dashboard rates={rates} loadingRates={loadingRates} error={error} />
          )}
        </main>
      </div>
    </Provider>
  );
};

export default App;
