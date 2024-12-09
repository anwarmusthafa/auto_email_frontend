import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../services/axiosSetUp';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post('/accounts/login/', {
        email,
        password
      });

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-login-wrapper">
      <div className="auth-login-container">
        <div className="auth-login-header">
          <h1>Welcome Back</h1>
          <p>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-login-form">
          {error && <div className="auth-global-error">{error}</div>}

          <div className="auth-form-group">
            <input
              type="email"
              className="auth-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          

          <button 
            type="submit" 
            className="auth-login-button" 
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>

          <div className="auth-signup-prompt">
            Don't have an account? 
            <button 
              type="button" 
              className="auth-signup-link"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;