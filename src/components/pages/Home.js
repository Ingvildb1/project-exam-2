import React, { useState, useEffect } from 'react';
import VenueCard from '../VenueCard';
import './../../App.css';
import Login from './Login'; // Import the Login component

const url = 'https://api.noroff.dev/api/v1/holidaze/venues';

function Home() {
  const [venues, setVenues] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState(null); // User state to track authentication

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  // Function to handle user login
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  return (
    <div>
      {user ? ( // Check if the user is authenticated
        <>
          <h2>Welcome, {user.name}!</h2>
          <div className='search'>
            <input
              placeholder='Search for venues'
              value={searchText}
              onChange={handleInputChange}
            />
          </div>
          <h3>Popular venues</h3>
          <div className='container'>
            {/* Render Venue Cards */}
            {filteredVenues.length > 0 ? (
              filteredVenues.slice(0, 30).map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))
            ) : (
              <div className='empty'>
                {searchText.trim() !== '' ? (
                  <h2>No venues found</h2>
                ) : (
                  <h2>Loading...</h2>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        // If user is not authenticated, render the Login component
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default Home;



