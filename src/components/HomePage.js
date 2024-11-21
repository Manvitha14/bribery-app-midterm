import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import briberyImage from "../images/bribery.webp"; // Adjust path if necessary
import overlayImage from "../images/overlay.webp"; // Add the overlay image
import { useOverlay } from "./OverlayContext"; // Import overlay context

const HomePage = () => {
  const navigate = useNavigate();
  const { showOverlay, setShowOverlay } = useOverlay(); // Use context state

  // Function to handle button click
  const handleRegisterComplaint = () => {
    navigate("/complaint-form"); // Navigate to the complaint form page
  };

  // Hide the overlay after the animation completes (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(false); // Update context state
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [setShowOverlay]);

  return (
    <>
      {/* Full-screen overlay */}
      {showOverlay && (
        <div className="image-overlay">
          <img
            src={overlayImage}
            alt="Bribery overlay"
            className="full-screen-image"
          />
        </div>
      )}

      {/* Homepage content */}
      <main className={`homepage ${showOverlay ? "hidden" : "visible"}`}>
        {/* Hero Section */}
        <section className="hero">
          <h2>
            <span role="img" aria-label="globe" className="icon">
              🌐
            </span>
            Welcome to the Bribery Complaint Registration System
          </h2>
          <p>
            Empowering citizens to report and track bribery-related cases
            seamlessly.
          </p>
          <img
            src={briberyImage}
            alt="Representation of bribery"
            className="bribery-image-small"
          />
        </section>

        {/* About Us Section */}
        <section className="about">
          <h3>About Us</h3>
          <p>
            Our platform provides a simple and secure way for citizens to report
            bribery cases. We aim to foster transparency and accountability in
            public services.
          </p>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h3>How It Works</h3>
          <div className="steps">
            <div className="step-card">
              <h4>Step 1</h4>
              <p>Fill out the complaint registration form.</p>
            </div>
            <div className="step-card">
              <h4>Step 2</h4>
              <p>Provide necessary evidence (if any).</p>
            </div>
            <div className="step-card">
              <h4>Step 3</h4>
              <p>Submit the complaint securely.</p>
            </div>
            <div className="step-card">
              <h4>Step 4</h4>
              <p>Track the progress of your case.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h3>Key Features</h3>
          <ul>
            <li>🔒 Secure and Anonymous Reporting</li>
            <li>📈 Track Your Complaint's Progress</li>
            <li>🌍 Global Access and User-Friendly Interface</li>
            <li>💬 Direct Communication with Authorities</li>
          </ul>
        </section>

        {/* Statistics Section */}
        <section className="statistics">
          <h3>Statistics</h3>
          <div className="stats">
            <div className="stat-item">
              <h4>1000+</h4>
              <p>Complaints Registered</p>
            </div>
            <div className="stat-item">
              <h4>500+</h4>
              <p>Cases Resolved</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta">
          <h3>Join Us in the Fight Against Bribery</h3>
          <button className="btn-primary" onClick={handleRegisterComplaint}>
            📝 Register a Complaint Now
          </button>
        </section>
      </main>
    </>
  );
};

export default HomePage;
