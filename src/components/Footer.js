import React from "react";
import "./footer.css";
import { useOverlay } from "./OverlayContext";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material"; // Importing MUI icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <p>Email: support@digitalpolice.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
        <div className="footer-section social-media">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a
              href="https://facebook.com/digitalpolice"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Facebook fontSize="large" />
              <span>Facebook</span>
            </a>
            <a
              href="https://twitter.com/digitalpolice"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Twitter fontSize="large" />
              <span>Twitter</span>
            </a>
            <a
              href="https://linkedin.com/company/digitalpolice"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <LinkedIn fontSize="large" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://instagram.com/digitalpolice"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Instagram fontSize="large" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
        <div className="footer-section quick-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          🌟 Powered by Digital Police. &copy; {new Date().getFullYear()} All
          Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
