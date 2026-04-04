import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const billsSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    addBill: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare({ name, amount, dueDate }) {
        return {
          payload: {
            id: nanoid(),
            name: name?.trim() || 'Untitled Bill',
            amount: Number(amount) || 0,
            dueDate,
            paid: false,
            createdAt: new Date().toISOString()
          }
        };
      }
    },

    toggleBillPaid(state, action) {
      const bill = state.items.find((b) => b.id === action.payload);
      if (bill) bill.paid = !bill.paid;
    },

    updateBill(state, action) {
      const { id, changes } = action.payload;
      const idx = state.items.findIndex((b) => b.id === id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...changes };
      }
    },

    deleteBill(state, action) {
      state.items = state.items.filter((b) => b.id !== action.payload);
    }
  }
});

export const { addBill, toggleBillPaid, updateBill, deleteBill } = billsSlice.actions;
export default billsSlice.reducer;
