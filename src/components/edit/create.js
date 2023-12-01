import React, { useState, useEffect } from 'react';
import '../styles/styles.scss'
import './../../App.css';


const Create = ({ token, onCreationSuccess }) => {
  const [venueDetails, setVenueDetails] = useState({
    name: '',
    description: '',
    media: [],
    price: 0,
    maxGuests: 0,
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false
    },
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
      lat: 0,
      lng: 0
    }
  });
  
  const [isVenueManager, setIsVenueManager] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.venueManager) {
      setIsVenueManager(true);
    }
  }, []);
   // Early return if user is not a VenueManager
   if (!isVenueManager) {
    return <p>Access denied. You must be a venue manager to create venues.</p>;
  }

  /*const ParentComponent = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
  
    if (!userData || !userData.venueManager) {
      // Redirect or show an error message if the user is not a VenueManager
      return <p>Access denied. You must be a venue manager to create venues.</p>;
    }
  
    return <Create token={userData.accessToken} />;
  };*/

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "price" || name === "maxGuests" || name === "rating" || name === "lat" || name === "lng") {
      // Parse as a floating-point number and update if it's a valid number
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setVenueDetails(prevState => ({
          ...prevState,
          [name]: numericValue,
        }));
      }
    } else if (name === "media") {
      setVenueDetails(prevState => ({
        ...prevState,
        media: [value] 
      }));
    } else if (name in venueDetails.meta) {
      setVenueDetails(prevState => ({
        ...prevState,
        meta: {
          ...prevState.meta,
          [name]: e.target.checked // for checkboxes
        }
      }));
    } else if (name in venueDetails.location) {
      setVenueDetails(prevState => ({
        ...prevState,
        location: {
          ...prevState.location,
          [name]: value
        }
      }));
    } else {
      setVenueDetails(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setVenueDetails(prevState => ({
      ...prevState,
      meta: {
        ...prevState.meta,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token is missing.");
      return;
    }
  
    try {
      const response = await fetch('https://api.noroff.dev/api/v1/holidaze/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(venueDetails)
      });
  
      if (!response.ok) {
        const errorResponse = await response.json(); // Parse the error response
        console.error('Failed to create venue:', errorResponse);
        throw new Error('Failed to create venue');
      }
  
      const result = await response.json();
      console.log('Venue created successfully:', result);

      onCreationSuccess(); // Call the callback function after successful creation

  
      // Handle successful venue creation (e.g., redirecting to another page or clearing the form)
    } catch (error) {
      console.error('Error creating venue:', error);
    }
  };
  

  return (
    <div className="create-venue">
      <h1>Create New Venue</h1>
      <h3>Venue Details</h3>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label>Venue Name:</label>
          <input
            type="text"
            name="name"
            value={venueDetails.name}
            onChange={handleChange}
            placeholder="Venue Name"
            required
          />
        </div>
        <div className="form-group">
          <label>Venue Description:</label>
          <input
            type="text"
            name="description"
            value={venueDetails.description}
            onChange={handleChange}
            placeholder="Venue Description"
            required
          />
        
      <h3>Upload images</h3>
      <input 
        type="text" 
        name="media" 
        value={venueDetails.media[0] || ''} 
        onChange={handleChange} 
        placeholder="Venue Media URL" 
        />
      <label>Price:</label>
      <input type="number" name="price" value={venueDetails.price} onChange={handleChange} placeholder="Venue Price" required />
      <label>Max Guests:</label>
      <input type="number" name="maxGuests" value={venueDetails.maxGuests} onChange={handleChange} placeholder="Max Guests" required />
      <label>Venue Rating:</label>
      <input type="number" name="rating" value={venueDetails.rating} onChange={handleChange} placeholder="Venue Rating" />
      </div>

      <div className="form-group">
      <h3>Meta</h3>
      <label>
        Wifi:
        <input type="checkbox" name="wifi" checked={venueDetails.meta.wifi} onChange={handleCheckboxChange} />
      </label>
      <label>
      Parking:
        <input type="checkbox" name="parking" checked={venueDetails.meta.parking} onChange={handleCheckboxChange} />
      </label>
      <label>
      Breakfast:
        <input type="checkbox" name="breakfast" checked={venueDetails.meta.breakfast} onChange={handleCheckboxChange} />
      </label>
      <label>
      Pets:
        <input type="checkbox" name="pets" checked={venueDetails.meta.pets} onChange={handleCheckboxChange} />
      </label>
      </div>

      <div className="form-group">
      <h3>Venue Location</h3>
      {/* Inputs for address, city, zip, country, continent */}
      <input type="text" name="address" value={venueDetails.location.address} onChange={handleChange} placeholder="Address" />
      <input type="text" name="city" value={venueDetails.location.city} onChange={handleChange} placeholder="City" />
      <input type="text" name="zip" value={venueDetails.location.zip} onChange={handleChange} placeholder="Zip" />
      <input type="text" name="country" value={venueDetails.location.country} onChange={handleChange} placeholder="Country" />
      <input type="text" name="continent" value={venueDetails.location.continent} onChange={handleChange} placeholder="Continent" />
      <input type="number" name="lat" value={venueDetails.location.lat} onChange={handleChange} placeholder="Latitude" />
      <input type="number" name="lng" value={venueDetails.location.lng} onChange={handleChange} placeholder="Longitude" />
      </div>

      <div className="form-group">
          <button type="submit">Create Venue</button>
        </div>
      </form>
    </div>
  );
};

export default Create;
