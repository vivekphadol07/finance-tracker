import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './Slices/transactionsSlice';
import categoriesReducer from './Slices/categoriesSlice';
import budgetsReducer from './Slices/budgetsSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    categories: categoriesReducer,
    budgets: budgetsReducer,
  },
});
