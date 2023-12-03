import React, { useState, useEffect } from 'react';
import VenueCard from '../VenueCard';
import './../../App.css';
import '../styles/styles.scss'
import Login from './Login'; 

const url = 'https://api.noroff.dev/api/v1/holidaze/venues';

function Home() {
  const [venues, setVenues] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const itemsPerPage = 10; // Number of items per page

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

  // Calculate the total number of pages
  const pageCount = Math.ceil(filteredVenues.length / itemsPerPage);

  // Get the venues for the current page
  const indexOfLastVenue = currentPage * itemsPerPage;
  const indexOfFirstVenue = indexOfLastVenue - itemsPerPage;
  const currentVenues = filteredVenues.slice(indexOfFirstVenue, indexOfLastVenue);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  // Function to handle user login
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  return (
      <div>
        <h3>Find your next adventure</h3>
        <div className='search'>
          <input
            placeholder='Search for venues'
            value={searchText}
            onChange={handleInputChange}
          />
        </div>
        
        <div className='container'>
          {currentVenues.length > 0 ? (
            currentVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} user={user} />
            ))
          ) : (
            <div className='empty'>
              {searchText.trim() !== '' ? <h2>No venues found</h2> : <h2>Loading...</h2>}
            </div>
          )}
        </div>
  
        <div className="pagination">
          {Array.from({ length: pageCount }, (_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
  
        {!user && (
          // Show login component only if user is not authenticated
          <div>
          <h3>Want to make a booking? Then you need to log in first!</h3>
          <Login onLogin={handleLogin} />
          </div>
          
        )}
      </div>
    );
}

export default Home;



