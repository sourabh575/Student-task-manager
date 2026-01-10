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
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        flexDirection: 'column',
        gap: '2rem',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem'
          }}>🔒</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 1rem 0'
          }}>
            You Need to Sign Up
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
            lineHeight: '1.6'
          }}>
            Create an account to start managing your tasks.
          </p>
          <p style={{
            fontSize: '0.9375rem',
            color: '#9ca3af',
            marginBottom: '2rem',
            lineHeight: '1.5'
          }}>
            Already have an account? You can log in with your existing credentials.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="/signup" 
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: '#10b981',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#059669';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#10b981';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              Create Account
            </a>
            <a 
              href="/login" 
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: '#e5e7eb',
                color: '#1f2937',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#d1d5db';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Log In
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return element;
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
