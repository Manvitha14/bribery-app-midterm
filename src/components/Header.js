import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../images/digipo.jpg"; // Import the logo image
import { logout, decryptToken } from "../authUtils";

const Header = () => {
  const navigate = useNavigate(); // Initialize navigation function
  const [userDetails, setUserDetails] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null); // Reference to the profile dropdown

  // Decode JWT and extract user details
  const handleProfileClick = () => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const decryptedToken = decryptToken(token);

      // Decode JWT manually
      const base64Url = decryptedToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedToken = JSON.parse(atob(base64));

      const userData = {
        name: decodedToken.name || "N/A",
        email: decodedToken.email || "N/A",
        role: decodedToken.role || "User",
      };

      setUserDetails(userData);
      setShowProfileDropdown((prev) => !prev); // Toggle dropdown visibility
    } catch (error) {
      console.error("Error decoding token:", error);
      alert("Failed to retrieve user details.");
    }
  };

  // Close the profile dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfileDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigation handlers
  const handleRegisterComplaint = () => {
    navigate("/complaint-form");
  };

  const handleSeeAllCases = () => {
    navigate("/see-all-cases");
  };

  const handleResources = () => {
    navigate("/resources");
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
            <a onClick={handleSeeAllCases}>📂 See All Cases</a>
          </li>
          <li>
            <a onClick={handleRegisterComplaint}>📝 Register a Complaint</a>
          </li>
          <li>
            <a onClick={handleResources}>📚 Resources</a>
          </li>
          <li ref={profileRef} className="profile-dropdown-container">
            <a onClick={handleProfileClick}>Profile</a>
            {showProfileDropdown && userDetails && (
              <div className="profile-dropdown">
                <p>
                  <strong>Name:</strong> {userDetails.name}
                </p>
                <p>
                  <strong>Email:</strong> {userDetails.email}
                </p>
                <p>
                  <strong>Role:</strong> {userDetails.role}
                </p>
              </div>
            )}
          </li>
          <li>
            <a onClick={logout}>Logout</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
