import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/ui/Header';
import FeedPage from './components/pages/FeedPage';
import PersonasPage from './components/pages/PersonasPage';
import PersonaEditPage from './components/pages/PersonaEditPage';
import { PersonaProvider } from './contexts/PersonaContext';

const App: React.FC = () => {
  return (
    <PersonaProvider>
      <div className="min-h-screen bg-background font-sans">
        <Header />
        <main className="container mx-auto max-w-2xl px-4 py-8">
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/personas" element={<PersonasPage />} />
            <Route path="/personas/new" element={<PersonaEditPage />} />
            <Route path="/personas/edit/:id" element={<PersonaEditPage />} />
          </Routes>
        </main>
        <footer className="text-center py-4 text-outline text-sm">
          <p>由 Gemini 驱动</p>
        </footer>
      </div>
    </PersonaProvider>
  );
};

export default App;