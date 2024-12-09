// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Oops! Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link  to="/home">Go back to Home</Link>
    </div>
  );
};

export default NotFound;
