import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './HomePage.css'; // Import a separate CSS file for styling

const HomePage = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  const handleExploreClasses = () => {
    navigate('/profile');  // Redirect to the /profile route
  };

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1 className="homepage-title">Welcome to Your Dashboard</h1>
        <p className="homepage-description">
          Stay organized, explore your classrooms, and make learning efficient and fun!
        </p>
        <button className="explore-button" onClick={handleExploreClasses}>
          Explore Classes
        </button>
      </div>
    </div>
  );
};

export default HomePage;
