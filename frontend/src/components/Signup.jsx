import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/axiosInstance';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.name.trim()) throw new Error('Name is required');
      if (!formData.email.trim()) throw new Error('Email is required');
      if (!formData.password) throw new Error('Password is required');
      if (formData.password.length < 6) throw new Error('Password must be at least 6 characters');
      if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');

      const response = await API.post('/auth/signup', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSuccess('Account created! Redirecting...');
      alert('✅ Account created successfully! Welcome to Enginow!');
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500);
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed';
      setError(errorMessage);
      
      // Show alert for signup errors
      if (err.response?.status === 400 && errorMessage.includes('already exists')) {
        alert('❌ Email already registered. Please log in or use a different email.');
      } else if (err.message === 'Passwords do not match') {
        alert('❌ Passwords do not match. Please check your password confirmation.');
      } else if (err.message === 'Password must be at least 6 characters') {
        alert('❌ Password must be at least 6 characters long.');
      } else {
        alert(`❌ ${errorMessage}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-side">
        <div className="auth-side-content">
          <h2 className="auth-side-title">Get Started</h2>
          <p className="auth-side-text">Join thousands of users managing tasks effectively</p>
          <div className="auth-side-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">Free to get started</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">Secure and private</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">No credit card required</div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-wrapper animate-slide-up">
          <div className="auth-form-header">
            <div className="auth-form-logo">
              <div className="auth-form-logo-icon">✓</div>
            </div>
            <h1 className="auth-form-title">Sign Up</h1>
            <p className="auth-form-subtitle">Create your free account</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              <span className="alert-icon">✅</span>
              <span>{success}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Full Name"
                className="auth-form-input"
                required
                autoComplete="name"
              />
            </div>

            <div className="auth-form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="auth-form-input"
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="auth-form-input"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.125rem'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="auth-form-input"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.125rem'
                  }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.25rem' }}>
                  Passwords don't match
                </div>
              )}
            </div>

            <div className="auth-form-actions">
              <button
                type="submit"
                disabled={loading}
                className="auth-form-submit"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="auth-form-link">
            Already have an account?{' '}
            <Link to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;