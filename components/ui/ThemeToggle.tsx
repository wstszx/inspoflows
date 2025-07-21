import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { MoonIcon } from '../icons/MoonIcon';
import { SunIcon } from '../icons/SunIcon';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-surface hover:bg-surface/80 transition-colors border border-outline/20"
      aria-label={`切换到${theme === 'light' ? '暗色' : '亮色'}模式`}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5 text-onSurface" />
      ) : (
        <SunIcon className="w-5 h-5 text-onSurface" />
      )}
    </button>
  );
};

export default ThemeToggle;