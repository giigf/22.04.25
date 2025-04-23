// ThemeToggle.js - New component for theme switching
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      // Switch to light theme
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark theme
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDarkMode ? '☀️ Светлая тема' : '🌙 Темная тема'}
    </button>
  );
}