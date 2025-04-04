import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ChatView from './ChatView';

const Main: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // Load theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    setIsDark(theme === 'dark');
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-content p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="cursor-pointer">
            <h1 className="text-2xl font-bold">Customer Support AI Assistant</h1>
            <p className="opacity-80">Get support with knowledge-powered AI assistance</p>
          </Link>

          <button
            onClick={toggleDarkMode}
            className="btn rounded-full btn-outline border-slate-600 ml-2 p-3"
            title="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Routes>
          <Route path="/" element={<ChatView />} />
          <Route path="/chat/:chatId" element={<ChatView />} />
        </Routes>
      </div>

      <footer className="bg-neutral text-neutral-content p-4 text-center text-sm">
        <p>Hackathon Challenge: AI-powered Customer Support</p>
        <div className="flex items-center justify-center mt-2 space-x-2">
          <span className="text-sm">Powered by</span>
          <a
            href="https://www.polytope.com/"
            className="font-bold text-transparent bg-clip-text hover:opacity-90 transition-opacity"
            style={{
              background: "linear-gradient(to right, #ffa683, #ff76c2)",
              WebkitBackgroundClip: "text"
            }}
          >
            POLYTOPE
          </a>
          <span className="text-sm">and</span>
          <a
            style={{ color: "#fff" }}
            href="https://www.opper.ai/"
            className="text-sm font-medium hover:underline"
          >
            Opper
          </a>
        </div>
      </footer>
    </main>
  );
};

export default Main;
