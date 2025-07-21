import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/ui/Header';
import FeedPage from './components/pages/FeedPage';
import PersonasPage from './components/pages/PersonasPage';
import PersonaEditPage from './components/pages/PersonaEditPage';
import SearchPage from './components/pages/SearchPage';
import SavedPage from './components/pages/SavedPage';
import SettingsPage from './components/pages/SettingsPage';
import { PersonaProvider } from './contexts/PersonaContext';
import { FeedContentProvider } from './contexts/FeedContentContext';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PersonaProvider>
        <FeedContentProvider>
          <div className="min-h-screen bg-background font-sans transition-colors duration-200">
            <Header />
            <main className="container mx-auto max-w-2xl px-4 py-8">
              <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/personas" element={<PersonasPage />} />
                <Route path="/personas/new" element={<PersonaEditPage />} />
                <Route path="/personas/edit/:id" element={<PersonaEditPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
            <footer className="text-center py-4 text-outline text-sm">
              <p>由 Gemini 驱动</p>
            </footer>
          </div>
        </FeedContentProvider>
      </PersonaProvider>
    </ThemeProvider>
  );
};

export default App;