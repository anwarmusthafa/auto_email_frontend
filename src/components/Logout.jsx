import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../services/axiosSetUp';
import { message } from 'antd';

const Logout = () => {
  const navigate = useNavigate();
  let isLoggingOut = false; // Flag to prevent multiple logouts

  useEffect(() => {
    const performLogout = async () => {
      if (isLoggingOut) return; // Exit if already logging out
      isLoggingOut = true; // Set flag to indicate logging out

      try {
        // Get the refresh token from local storage
        const refreshToken = localStorage.getItem('user_refresh_token');
        console.log("Refresh Token:", refreshToken);

        // If no refresh token is found, redirect to login
        if (!refreshToken) {
          message.warning('No refresh token found. Redirecting to login.');
          navigate('/login');
          return;
        }

        // Call the logout API
        const response = await axiosInstance.post('accounts/logout/', { refresh: refreshToken });

        if (response.status === 200) {
          // Clear local storage upon successful logout
          localStorage.clear();
          // Show a success notification
          message.success('Logged out successfully');
          // Redirect to the login page
          navigate('/login');
        } else {
          // Handle unexpected response
          message.error('Logout failed. Please try again.');
          navigate('/login');
        }
      } catch (error) {
        // Handle logout errors and log them to the console
        console.log('Logout error:', error);
        // Show an error notification
        message.error('Logout failed. Please try again.');
        // Redirect to the login page regardless of the error
        navigate('/login');
      }
    };

    performLogout();
  }, [navigate]);

  // Optionally return null or a loading indicator
  return null;
};

export default Logout;
