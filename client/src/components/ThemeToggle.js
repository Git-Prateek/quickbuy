import React, { useEffect, useState } from 'react';

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark';
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="d-flex justify-content-end p-2 position-fixed top-0 end-0" style={{ zIndex: 999 }}>
      <button className="btn btn-green" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
}

export default ThemeToggle;
