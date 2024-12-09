import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignUpPage';
import OTPVerificationPage from './pages/OtpVerificationPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import ScheduleEmailPage from './pages/ScheduleEmailPage';
import Logout from './components/Logout';

import NotFound from './pages/NotFound'


function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp-verification" element={<OTPVerificationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<ProtectedRoute> <HomePage /></ProtectedRoute>} />
        <Route path="/schedule-email" element={<ProtectedRoute> <ScheduleEmailPage /></ProtectedRoute>} />
        <Route path="/logout" element={<ProtectedRoute> <Logout /></ProtectedRoute>} />
        <Route path="*" element={<NotFound/>} /> 
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
