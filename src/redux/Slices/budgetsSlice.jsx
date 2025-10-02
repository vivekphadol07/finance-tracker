import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  monthlyGoals: {},
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setMonthlyBudget(state, action) {
      const { monthKey, totalBudget, categories } = action.payload;
      state.monthlyGoals[monthKey] = { totalBudget, categories: categories || {} };
    },

    updateCategoryBudget(state, action) {
      const { monthKey, category, amount } = action.payload;
      if (!state.monthlyGoals[monthKey]){
        state.monthlyGoals[monthKey] = { totalBudget: 0, categories: {} };
      } 
      state.monthlyGoals[monthKey].categories[category] = amount;
    },
    
    removeMonthlyBudget(state, action) {
      delete state.monthlyGoals[action.payload];
    }
  }
});

export const { setMonthlyBudget, updateCategoryBudget, removeMonthlyBudget } = budgetsSlice.actions;
export default budgetsSlice.reducer;
