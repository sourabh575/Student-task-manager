import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        {/* Logo/Brand */}
        <Link to="/" className="header-brand">
          <div className="header-brand-icon">✓</div>
          <span>TASK</span>
        </Link>

        {/* Navigation Actions */}
        <nav className="header-nav">
          <Link to="/add" className="btn btn-success" aria-label="Add new task">
            <span>+</span>
            <span>New Task</span>
          </Link>

          {/* User Menu */}
          {user && (
            <div className="header-user">
              <div className="header-user-avatar" title={user.name}>
                {getUserInitials()}
              </div>
              <div className="header-user-info">
                <div className="header-user-name">{user.name}</div>
                <div className="header-user-email">{user.email}</div>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleLogout}
                aria-label="Logout"
              >
                Sign Out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;