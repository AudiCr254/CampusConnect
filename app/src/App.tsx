import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAskAI } from '@/components/FloatingAskAI';
import { HomePage } from '@/pages/HomePage';
import { NotesPage } from '@/pages/NotesPage';
import { AskAIPage } from '@/pages/AskAIPage';
import AdminPage from '@/pages/AdminPage';
import './App.css';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/ask-ai" element={<AskAIPage />} />
        </Routes>
      </div>
      <Footer />
      <FloatingAskAI />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
}

export default App;
