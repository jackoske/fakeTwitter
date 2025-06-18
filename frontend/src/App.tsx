import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TweetPage from './pages/TweetPage';
import UserPage from './pages/UserPage';
import TweetsPage from './pages/TweetsPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tweet/:tweetId" element={<TweetPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/tweets" element={<TweetsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 