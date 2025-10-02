import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare({ type, amount, currency, convertedBase, category, date, notes }) {
        return {
          payload: {
            id: nanoid(),
            type,
            amount: Number(amount),
            currency,
            convertedBase: Number(convertedBase),
            category,
            date,
            notes: notes || '',
          },
        };
      },
    },

    editTransaction(state, action) {
      const { id, changes } = action.payload;
      const idx = state.items.findIndex((transaction) => transaction.id === id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...changes }
      };
    },

    deleteTransaction(state, action) {
      state.items = state.items.filter((transaction) => transaction.id !== action.payload);
    },

    importTransactions(state, action) {
      state.items = action.payload;
    },
  },
});

export const { addTransaction, editTransaction, deleteTransaction, importTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
