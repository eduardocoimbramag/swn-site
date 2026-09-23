import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CasesIndex from './pages/CasesIndex';
import CaseCategoryPage from './pages/CaseCategoryPage';
import CasePage from './pages/CasePage';
import ScrollToTop from './components/ScrollToTop';
import FloatingWhatsApp from './components/FloatingWhatsApp';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Cases: categories → category gallery → individual case.
            /cases/:category also forwards legacy /cases/:case-slug links. */}
        <Route path="/cases" element={<CasesIndex />} />
        <Route path="/cases/:category" element={<CaseCategoryPage />} />
        <Route path="/cases/:category/:slug" element={<CasePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingWhatsApp />
    </BrowserRouter>
  );
}

export default App;
