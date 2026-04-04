import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './Slices/transactionsSlice';
import categoriesReducer from './Slices/categoriesSlice';
import budgetsReducer from './Slices/budgetsSlice';
import uiReducer from './Slices/uiSlice';
import billsReducer from './Slices/billsSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('trackerState');
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    
    // Safety check: skip loading from localStorage if transactions are empty
    // to allow seeding from data.js
    if (!state.transactions?.present?.items || state.transactions.present.items.length === 0) {
      return undefined;
    }
    
    return state;
  } catch {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('trackerState', serializedState);
  } catch {
    // ignore write errors
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    categories: categoriesReducer,
    budgets: budgetsReducer,
    ui: uiReducer,
    bills: billsReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

