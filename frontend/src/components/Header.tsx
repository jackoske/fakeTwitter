import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Twitter Mock
          </Link>
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/user" 
              className={`nav-link ${isActive('/user') ? 'active' : ''}`}
            >
              User Profile
            </Link>
            <Link 
              to="/tweets" 
              className={`nav-link ${isActive('/tweets') ? 'active' : ''}`}
            >
              All Tweets
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 