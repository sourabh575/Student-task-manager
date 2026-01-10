import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main 
      style={styles.container}
      role="main"
      aria-label="Page not found"
    >
      <div style={styles.content} className="animate-scale-in">
        <div style={styles.iconContainer}>
          <div style={styles.icon} aria-hidden="true">404</div>
        </div>
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.description}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          style={styles.button}
          aria-label="Go back to home page"
        >
          <span aria-hidden="true">←</span>
          Back to Tasks
        </Link>
      </div>
    </main>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(1rem, 4vw, 2rem)',
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    position: 'relative'
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    padding: '3rem 2rem',
    borderRadius: '1.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    position: 'relative',
    zIndex: 1
  },
  iconContainer: {
    marginBottom: '1.5rem'
  },
  icon: {
    fontSize: 'clamp(4rem, 15vw, 8rem)',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1,
    display: 'inline-block'
  },
  title: {
    fontSize: 'clamp(1.5rem, 8vw, 3rem)',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.75rem',
    letterSpacing: '-0.02em'
  },
  description: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '2rem',
    lineHeight: '1.6',
    maxWidth: '400px',
    margin: '0 auto 2rem'
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
  }
};

export default NotFound;