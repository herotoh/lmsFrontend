import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found 2 </h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>
        Go back to <Link to="/" style={{ color: '#007bff' }}>Home</Link>
      </p>
    </div>
  );
};

export default NotFound;