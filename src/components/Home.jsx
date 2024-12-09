import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../services/axiosSetUp';
import './Home.css';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/');
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
        
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleScheduleEmail = () => {
    navigate('/schedule-email');
  };

  const handleLogout = () => {
    // Remove token from localStorage
    
    navigate('/logout');
  };

  if (loading) {
    return (
      <div className="auth-home-loader">
        <div className="auth-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-home-error">
        <p>{error}</p>
        <button onClick={() => navigate('/login')} className="auth-error-login-btn">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="auth-home-wrapper">
      <div className="auth-home-header">
        <div className="auth-home-header-content">
          <div className="auth-home-user-section">
            <div className="auth-home-user-info">
              
              <div className="auth-home-user-actions">
                
                <button 
                  onClick={handleLogout} 
                  className="auth-home-logout-btn"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-home-container">
        <div className="auth-home-content">
          <div className="auth-home-welcome">
            <h1>Welcome to AutoEmail</h1>
            <p>Your powerful email scheduling and automation platform</p>
          </div>

          <div className="auth-home-features-container">
            <div className="auth-home-features">
              <div className="auth-home-feature">
                <div className="auth-home-feature-icon">📅</div>
                <h3>Email Scheduling</h3>
                <p>Schedule emails to be sent at the perfect time</p>
              </div>

              <div className="auth-home-feature">
                <div className="auth-home-feature-icon">🚀</div>
                <h3>Automation</h3>
                <p>Automate your email workflows effortlessly</p>
              </div>

              <div className="auth-home-feature">
                <div className="auth-home-feature-icon">🔒</div>
                <h3>Secure</h3>
                <p>Your data is always protected and private</p>
              </div>
            </div>
          </div>

          <div className="auth-home-cta-container">
            <button 
              onClick={handleScheduleEmail} 
              className="auth-home-schedule-btn"
            >
              Schedule New Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;