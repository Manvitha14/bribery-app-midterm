import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const BackToHomeButton = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleBackToHome = () => {
    navigate('/home'); // Adjust the path based on your app's structure
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <button
        onClick={handleBackToHome}
        style={{
           
            position: 'absolute', // This ensures it is positioned absolutely within its parent container
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
           
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default BackToHomeButton;
