import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Settings from './pages/Settings';
import SecuritySettings from './pages/SecuritySettings';
import Create from './pages/Create';
import Series from './pages/Series';
import Movies from './pages/Movies';
import NewPopular from './pages/NewPopular';


const App = () => {
  return (
    <BrowserRouter basename="/eray">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/security" element={<SecuritySettings />} />
        <Route path="/create" element={<Create />} />
        <Route path="/series" element={<Series />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/new-popular" element={<NewPopular />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
