import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-black">
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
      </Routes>
      </div>
    </Router>
  );
};

export default App; 