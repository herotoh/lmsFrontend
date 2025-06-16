import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Footer.css'; // Import the CSS for styling

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>
        &copy; 2025 Library Management System. All rights reserved. |{' '}
        <Link to="/contact" className="footer-link">Contact Us</Link> {/* NEW CONTACT LINK IN FOOTER */}
        <Link to="/disclaimer" className="footer-link">Disclaimer</Link> {/* NEW DISCLAIMER LINK */}
        
      </p>
      {/* You can add more links or info here if needed in the future */}
    </footer>
  );
};

export default Footer;
