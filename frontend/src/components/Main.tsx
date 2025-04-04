import React, { useEffect, useMemo, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import ChatView from './ChatView';
import CSAnalyticsDashboard from './CSAnalyticsDashboard';
import { storeChat } from '../services/chatStorage';
import { createChatApi } from '../rest/modules/chat';
import { ApiClientRest } from '../rest/api_client_rest';

const Main: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const apiClient = useMemo(() => new ApiClientRest(), []);
  const chatApi = useMemo(() => createChatApi(apiClient), [apiClient]);

  // Load theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    setIsDark(theme === 'dark');

    chatApi.getAllChats().then(result => {
      for (const chat of result) {
        storeChat(chat);
      }
    })

  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-content p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="cursor-pointer">
            <h1 className="text-2xl font-bold">Customer Support AI Assistant</h1>
            <p className="opacity-80">Get support with knowledge-powered AI assistance</p>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAnalytics}
              className={`btn ${showAnalytics ? 'btn-accent' : 'btn-outline'} flex items-center gap-2 p-4 mx-4`}
              title="Analytics Dashboard"
            >
              <BarChart3 size={18} />
              <span className="hidden sm:inline">Analytics</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="btn rounded-full btn-outline border-slate-600 ml-2 p-3"
              title="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {showAnalytics ? (
          <div className="w-full p-4 overflow-auto">
            <CSAnalyticsDashboard />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<ChatView />} />
            <Route path="/chat/:chatId" element={<ChatView />} />
          </Routes>
        )}
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
