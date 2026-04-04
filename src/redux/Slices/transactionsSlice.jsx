import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { mockApi } from '../../services/mockApi';

export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async () => {
  return await mockApi.fetchTransactions();
});

import { transactions as sampleTransactions } from '../../data/data';

const initialState = {
  past: [],
  present: {
    items: sampleTransactions || [],
    status: 'idle',
    error: null,
  },
  future: []
};

const saveStateHistory = (state) => {
  state.past.push({ items: [...state.present.items] });
  if (state.past.length > 20) {
    state.past.shift(); // Limit history to 20 steps
  }
  state.future = []; // Clear future on new action
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: {
      reducer(state, action) {
        saveStateHistory(state);
        state.present.items.unshift(action.payload);
      },
      prepare({ type, amount, currency, convertedBase, category, date, note, notes }) {
        return {
          payload: {
            id: nanoid(),
            type,
            amount: Number(amount),
            currency,
            convertedBase: Number(convertedBase),
            category,
            date,
            note: note ?? notes ?? '',
          },
        };
      },
    },

    editTransaction(state, action) {
      const { id, changes } = action.payload;
      const idx = state.present.items.findIndex((t) => t.id === id);
      if (idx !== -1) {
        saveStateHistory(state);
        state.present.items[idx] = { ...state.present.items[idx], ...changes };
      }
    },

    deleteTransaction(state, action) {
      saveStateHistory(state);
      state.present.items = state.present.items.filter((t) => t.id !== action.payload);
    },

    importTransactions(state, action) {
      saveStateHistory(state);
      state.present.items = action.payload;
    },

    undo(state) {
      if (state.past.length > 0) {
        const previous = state.past.pop();
        state.future.unshift({ items: [...state.present.items] });
        state.present.items = previous.items;
      }
    },

    redo(state) {
      if (state.future.length > 0) {
        const next = state.future.shift();
        state.past.push({ items: [...state.present.items] });
        state.present.items = next.items;
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.present.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.present.status = 'succeeded';
        state.present.items = action.payload || [];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.present.status = 'failed';
        state.present.error = action.error.message;
      });
  }
});

export const { addTransaction, editTransaction, deleteTransaction, importTransactions, undo, redo } = transactionsSlice.actions;

// Selectors
export const selectTransactions = (state) => state.transactions?.present?.items || [];
export const selectTransactionsStatus = (state) => state.transactions?.present?.status || 'idle';
export const selectCanUndo = (state) => (state.transactions?.past?.length || 0) > 0;
export const selectCanRedo = (state) => (state.transactions?.future?.length || 0) > 0;

export default transactionsSlice.reducer;
