import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import KeyboardSearchModal from './components/KeyboardSearchModal';
import OverviewPage from './pages/OverviewPage';
import DataDictionaryPage from './pages/DataDictionaryPage';
import BrdPage from './pages/BrdPage';
import DataModelPage from './pages/DataModelPage';
import DashboardPage from './pages/DashboardPage';
import MachineLearningPage from './pages/MachineLearningPage';
import ChatbotRagPage from './pages/ChatbotRagPage';
import TestingPage from './pages/TestingPage';

import PresentationPage from './pages/PresentationPage';

// Scroll to top automatically when navigating between pages
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isPresentation = location.pathname === '/presentation';

  if (isPresentation) {
    return (
      <main className="w-screen h-screen overflow-hidden">
        <Routes>
          <Route path="/presentation" element={<PresentationPage />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#292A2E] font-sans">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <KeyboardSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/data-dictionary" element={<DataDictionaryPage />} />
          <Route path="/brd" element={<BrdPage />} />
          <Route path="/data-model" element={<DataModelPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/testing" element={<TestingPage />} />
          <Route path="/machine-learning" element={<MachineLearningPage />} />
          <Route path="/chatbot-rag" element={<ChatbotRagPage />} />
          <Route path="*" element={<OverviewPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout />
    </BrowserRouter>
  );
}
