import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Login Page Component
// Handles user authentication with email and password validation
const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for validation errors
  const [errors, setErrors] = useState({});
  
  // State for loading (simulating authentication)
  const [isLoading, setIsLoading] = useState(false);
  
  // State to track if in register mode
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Email validation regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Simulate authentication loading
    setIsLoading(true);
    setErrors({});
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const endpoint = isRegisterMode ? '/api/register' : '/api/login';
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || (isRegisterMode ? 'Registration failed' : 'Login failed'));
      }
      
      if (email && password) {
        // Store user info in localStorage for session persistence
        localStorage.setItem('user', JSON.stringify({
          id: data.user?.id || 'demo-id',
          email: email,
          name: email.split('@')[0],
          loginTime: new Date().toISOString(),
          session: data.session || 'mock-session-token'
        }));
        
        // Call the onLogin callback
        if (onLogin) {
          onLogin({ email, name: email.split('@')[0] });
        }
        
        // Navigate to home page
        navigate('/home');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ form: error.message || 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo and Title Section */}
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🍽️</span>
            <h1>Smart Food</h1>
          </div>
          <p className="tagline">Delicious meals delivered to your doorstep</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h2>{isRegisterMode ? 'Create Account' : 'Welcome Back!'}</h2>
          <p className="login-subtitle">
            {isRegisterMode ? 'Sign up to get started' : 'Please sign in to continue'}
          </p>

          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className={`input-field ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={`input-field ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" disabled={isLoading} />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {isRegisterMode ? 'Signing Up...' : 'Signing In...'}
              </>
            ) : (
              isRegisterMode ? 'Sign Up' : 'Sign In'
            )}
          </button>

          {errors.form && (
            <div className="form-error-message" style={{ color: '#e74c3c', marginTop: '15px', textAlign: 'center', backgroundColor: '#fdf0ed', padding: '10px', borderRadius: '4px' }}>
              {errors.form}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>
            {isRegisterMode ? "Already have an account?" : "Don't have an account?"} 
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setIsRegisterMode(!isRegisterMode);
              setErrors({});
            }}>
              {isRegisterMode ? " Sign in" : " Sign up"}
            </a>
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="privacy-notice">
          <p>🔒 Your privacy matters. We never share your personal information.</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="login-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};

export default Login;