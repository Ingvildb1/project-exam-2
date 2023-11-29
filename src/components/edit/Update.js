import React, { useState, useEffect } from 'react';

const Update = ({ accessToken, id, onUpdated }) => {
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

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          console.log("Venue deleted successfully");
          onUpdated(); 
        } else {
          console.error("Failed to delete venue");
        }
      } catch (error) {
        console.error("Error deleting venue:", error);
      }
    }
  };


  useEffect(() => {
    // Fetch the current details of the venue to be updated
    const fetchVenueDetails = async () => {
      try {
        const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVenueDetails(data);
        } else {
          console.error('Failed to fetch venue details');
        }
      } catch (error) {
        console.error('Error fetching venue details:', error);
      }
    };

    if (id) {
      fetchVenueDetails();
    }
  }, [id, accessToken]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(venueDetails),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Failed to update venue:', errorDetails);
        throw new Error('Failed to update venue');
      }

      const updatedVenue = await response.json();
      console.log('Venue updated successfully:', updatedVenue);
      onUpdated(); // Callback to inform the parent component about the update
    } catch (error) {
      console.error('Error updating venue:', error);
    }
  };

  

  

  return (
    <div>
      <h1>Update Venue</h1>
      <form onSubmit={handleSubmit}>
      <label>Venue Name:</label>
      <input type="text" name="name" value={venueDetails.name} onChange={handleChange} placeholder="Venue Name" required />
      <label>Venue Description:</label>
      <input type="text" name="description" value={venueDetails.description} onChange={handleChange} placeholder="Venue Description" required />
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

      <h3>Venue Location</h3>
      <input type="text" name="address" value={venueDetails.location.address} onChange={handleChange} placeholder="Address" />
      <input type="text" name="city" value={venueDetails.location.city} onChange={handleChange} placeholder="City" />
      <input type="text" name="zip" value={venueDetails.location.zip} onChange={handleChange} placeholder="Zip" />
      <input type="text" name="country" value={venueDetails.location.country} onChange={handleChange} placeholder="Country" />
      <input type="text" name="continent" value={venueDetails.location.continent} onChange={handleChange} placeholder="Continent" />
      <input type="number" name="lat" value={venueDetails.location.lat} onChange={handleChange} placeholder="Latitude" />
      <input type="number" name="lng" value={venueDetails.location.lng} onChange={handleChange} placeholder="Longitude" />

      <button type="submit">Update Venue</button>
      <button type="button" onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded mt-2">
        Delete Venue
      </button>
      </form>
      
    </div>
    );
};

export default Update;
