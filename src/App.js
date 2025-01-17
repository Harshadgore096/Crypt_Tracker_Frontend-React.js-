
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CryptoTracker from './crypto_list.jsx';
import TopGainers from './top-gainers.jsx';
import './App.css'; // or wherever your styles are located
import TopLosers from './top-looers.jsx';
 import NewListed from './newly-listed.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CryptoTracker />} />
        <Route path="/top-gainers" element={<TopGainers />} />
        <Route path="/top-looers" element={<TopLosers />} />
        <Route path="/newly-listed" element={<NewListed />} />
      
      </Routes>
    </Router>
  );
};

export default App;
