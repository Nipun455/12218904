import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ShortenerPage from './pages/ShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectHandler from './pages/RedirectHandler';

const App = () => {
  return (
    <Routes>
      <Route index element={<ShortenerPage />} />
      <Route path="stats" element={<StatisticsPage />} />
      <Route path=":shortcode" element={<RedirectHandler />} />
    </Routes>
  );
};

export default App;
