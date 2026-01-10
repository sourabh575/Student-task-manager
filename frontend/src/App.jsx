import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Signup from './components/Signup';
import { auth } from './utils/api';

// --------- Protected Route Component ----------
const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// --------- Public Route Component (redirect if logged in) ----------
const PublicRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? <Navigate to="/" replace /> : element;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = auth.getToken();
    setIsAuthenticated(!!token);
    setLoading(false);

    // Optional: Listen for storage changes (logout in another tab)
    const handleStorageChange = () => {
      const token = auth.getToken();
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} aria-label="Loading" role="status">
            <span className="sr-only">Loading application...</span>
          </div>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            fontWeight: '500',
            margin: 0
          }}>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ErrorBoundary>
        {isAuthenticated && <Header onLogout={() => setIsAuthenticated(false)} />}

        <Routes>
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={<PublicRoute element={<Login />} isAuthenticated={isAuthenticated} />}
          />
          <Route 
            path="/signup" 
            element={<PublicRoute element={<Signup />} isAuthenticated={isAuthenticated} />}
          />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={<ProtectedRoute element={<TaskList />} isAuthenticated={isAuthenticated} />}
          />
          <Route 
            path="/add" 
            element={<ProtectedRoute element={<AddTaskForm />} isAuthenticated={isAuthenticated} />}
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
