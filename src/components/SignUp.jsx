import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { axiosInstance } from '../services/axiosSetUp';
import { useDispatch } from 'react-redux';
import { setUserId } from '../redux/slices/profileSlice';
import './SignUp.css';

const SignUp = () => {
    const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setValidationErrors({});
    setError(null);
  };

  const validateForm = () => {
    const errors = {};
    const { email, name, password, confirmPassword } = formData;

    if (!email.includes('@')) {
      errors.email = 'Email must contain an "@" symbol.';
    }
    if (!name || name.length < 3) {
      errors.name = 'Name must be at least 3 characters.';
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      errors.password = 'Password must contain at least one digit.';
    }
    if (!/[!@#$%^&*()_+={}\[\]|\\:;\'",.<>?/-]/.test(password)) {
      errors.password = 'Password must contain at least one special character.';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/accounts/register/', {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.status === 201) {
        dispatch(setUserId(response.data.user_id)); // Store user_id in Redux state
        navigate('/otp-verification');
      }
    } catch (error) {
      if (error.response?.data?.error) {
        console.log("Error:" ,error.response.data.error);
        setError(error.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-signup-wrapper">
      <div className="auth-signup-container">
        <div className="auth-signup-header">
          <h1>Create Your Account</h1>
          <p>Join our community and get started!</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-signup-form">
          <div className="auth-form-group">
            <input
              type="text"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={validationErrors.email ? 'auth-input-error' : 'auth-input'}
            />
            {validationErrors.email && (
              <span className="auth-error-text">{validationErrors.email}</span>
            )}
          </div>

          <div className="auth-form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={validationErrors.name ? 'auth-input-error' : 'auth-input'}
            />
            {validationErrors.name && (
              <span className="auth-error-text">{validationErrors.name}</span>
            )}
          </div>

          <div className="auth-form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={validationErrors.password ? 'auth-input-error' : 'auth-input'}
            />
            {validationErrors.password && (
              <span className="auth-error-text">{validationErrors.password}</span>
            )}
          </div>

          <div className="auth-form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={validationErrors.confirmPassword ? 'auth-input-error' : 'auth-input'}
            />
            {validationErrors.confirmPassword && (
              <span className="auth-error-text">{validationErrors.confirmPassword}</span>
            )}
          </div>

          {error && <div className="auth-global-error">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="auth-signup-button"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>

          <div className="auth-signup-footer">
            <p>Already have an account? <Link to="/login" className="auth-login-link">Log In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;