import React from 'react';
import Header from './components/Header';
import ProductPage from './pages/ProductPage';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5efe5] text-stone-800 font-sans">
      <Header />
      <ProductPage />
      <Footer />
    </div>
  );
}