import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setAccentColor } from '../../redux/Slices/uiSlice';
import { Moon, Sun, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const ACCENT_COLORS = [
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'emerald', class: 'bg-emerald-500' },
  { name: 'violet', class: 'bg-violet-500' },
  { name: 'rose', class: 'bg-rose-500' },
];

export const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const currentAccent = useSelector((state) => state.ui.accentColor);
  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
    </button>
  );
};
