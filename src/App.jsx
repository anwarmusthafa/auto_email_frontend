import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignUpPage';
import OTPVerificationPage from './pages/OtpVerificationPage';
import LoginPage from './pages/LoginPage';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp-verification" element={<OTPVerificationPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* 
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
