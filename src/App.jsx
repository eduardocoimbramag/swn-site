import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CasesIndex from './pages/CasesIndex';
import CasePage from './pages/CasePage';
import ScrollToTop from './components/ScrollToTop';
import FloatingWhatsApp from './components/FloatingWhatsApp';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cases" element={<CasesIndex />} />
        <Route path="/cases/:slug" element={<CasePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingWhatsApp />
    </BrowserRouter>
  );
}

export default App;
