import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: 'Admin', // 'Admin' | 'Editor' | 'Viewer'
  theme: 'light', // 'light' | 'dark'
  accentColor: 'blue',
  activeTab: 'dashboard', // 'dashboard' | 'analytics' | 'transactions' | 'budgets' | 'settings'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setAccentColor: (state, action) => {
      state.accentColor = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Side effect to add dark class to root HTML
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
});

export const { setRole, toggleTheme, setTheme, setAccentColor, setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
