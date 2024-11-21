import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FaHome } from "react-icons/fa"; // Import the home icon from react-icons
import "./Header.css";
import logo from "../images/digipo.jpg"; // Import the image

const Header = () => {
  const navigate = useNavigate(); // Initialize navigation function

  // Logic for navigating to different routes
  const handleRegisterComplaint = () => {
    navigate("/complaint-form"); // Navigate to the complaint form
  };

  const handleSeeAllCases = () => {
    navigate("/see-all-cases"); // Navigate to /see-all-cases
  };

  const handleResources = () => {
    navigate("/resources"); // Navigate to the resources page
  };

  const handleProfile = () => {
    navigate("/profile"); // Navigate to the user's profile page
  };

  const handleTrackStatus = () => {
    navigate("/track-status"); // Navigate to the status tracking page
  };

  const handleLogout = () => {
    console.log("User logged out.");
    navigate("/login"); // Redirect to login page after logout
  };

  const handleBackToDigipo = () => {
    navigate("/"); // Navigate back to the Digipo homepage
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Digital Police Logo" className="logo-image" />
        <h1 className="logo-text">Digital Police</h1>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <a href="#back" onClick={handleBackToDigipo}>
              <FaHome style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Back to Digipo
            </a>
          </li>
          <li>
            <a href="#cases" onClick={handleSeeAllCases}>
              📂 See All Cases
            </a>
          </li>
          <li>
            <a href="#register" onClick={handleRegisterComplaint}>
              📝 Register a Complaint
            </a>
          </li>
          <li>
            <a href="#resources" onClick={handleResources}>
              📚 Resources
            </a>
          </li>
          <li>
            <a href="#profile" onClick={handleProfile}>
              👤 Profile
            </a>
          </li>
          <li>
            <a href="#logout" onClick={handleLogout}>
              🚪 Logout
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
