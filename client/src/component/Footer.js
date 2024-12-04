import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Import social icons from react-icons
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>EduConnect</h2>
        </div>
        <div className="footer-links">
          <a href="/about" className="footer-link">About Us</a>
          
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <a href="/terms" className="footer-link">Terms of Service</a>
        </div>
        <div className="footer-social">
          <p>Follow us:</p>
          <div className="footer-social-icons">
            <a href="https://www.facebook.com/profile.php?id=100062503774517" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={30} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={30} />
            </a>
            <a href="https://instagram.com/shubhamprajapati1787" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={30} />
            </a>
            <a href="https://www.linkedin.com/in/shubham-prajapati-4a4262241/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={30} />
            </a>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} EduConnect. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
