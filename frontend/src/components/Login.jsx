import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/axiosInstance';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      if (!formData.email.trim()) throw new Error('Email is required');
      if (!formData.password) throw new Error('Password is required');

      const response = await API.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-side">
        <div className="auth-side-content">
          <h2 className="auth-side-title">Welcome Back</h2>
          <p className="auth-side-text">Continue managing your tasks efficiently</p>
          <div className="auth-side-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">Organize tasks by priority</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">Track progress effortlessly</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">✓</div>
              <div className="auth-feature-text">Simple and intuitive design</div>
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
            <h1 className="auth-form-title">Sign In</h1>
            <p className="auth-form-subtitle">Sign in to access your tasks</p>
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
                  autoComplete="current-password"
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
                    fontSize: '1.125rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
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
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="auth-form-link">
            New user?{' '}
            <Link to="/signup">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;