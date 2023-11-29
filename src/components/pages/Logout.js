// Logout.js
import React from 'react';
import { useHistory } from 'react-router-dom'; 

function Logout({ onLogout }) {
  const history = useHistory(); // Create an instance of useHistory

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear(); // Remove all data in local storage

    // Call the onLogout function passed from the parent component
    if (onLogout) {
      onLogout();
    }

    // Redirect to login or home page after logout
    history.push('/login'); 
  };

  return (
    <button onClick={handleLogout}>Log Out</button>
  );
}

export default Logout;

