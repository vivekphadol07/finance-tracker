import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: ['food','rent','entertainment','salary','transport','utilities','others']
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory(state, action) {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      };
    },
    
    removeCategory(state, action) {
      state.items = state.items.filter(category => category !== action.payload);
    }
  }
});

export const { addCategory, removeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
