import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ConsentForm from './pages/ConsentForm';
import ViewDocument from './pages/ViewDocument';
import VerifyConsent from './pages/VerifyConsent';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-consent" element={<ConsentForm />} />
          <Route path="/view/:id" element={<ViewDocument />} />
          <Route path="/verify" element={<VerifyConsent />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 