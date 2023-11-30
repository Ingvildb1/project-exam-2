import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Create from "../edit/create";
import Update from "../edit/Update";
import Bookings from '../edit/Bookings';
import Specific from './Specific'; 
import '../styles/styles.scss'
import '../../App.css'



const Profile = () => {
  const [avatar, setAvatar] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshBookings, setRefreshBookings] = useState(false); 
  const bookingsPerPage = 5;
  const [venues, setVenues] = useState([]); 
  const [editingVenueId, setEditingVenueId] = useState(null);

  const onVenueCreationSuccess = () => {
    const name = localStorage.getItem("name");
    if (name) {
      fetchVenuesByProfileName(name);
    }
  };

    // Function to trigger re-fetch of bookings
    const handleNewBooking = () => {
      setRefreshBookings(true); 
    };
  

  // Ensure the correct function is called to fetch venues
  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      fetchBookingsByProfileName(name);
      setRefreshBookings(false); 
      fetchVenuesByProfileName(name);
    } else {
      console.error("'name' is missing from localStorage.");
    }
  }, [refreshBookings]);

  const token = localStorage.getItem('accessToken');
  
  

  // Function to fetch venues associated with the profile
  const fetchVenuesByProfileName = async (profileName) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Access token is missing.");
        return;
      }

      const response = await fetch(
        `https://api.noroff.dev/api/v1/holidaze/profiles/${profileName}/venues`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const venuesData = await response.json();
        setVenues(venuesData);
      } else {
        console.error("Failed to fetch venues by profile name.");
      }
    } catch (error) {
      console.error("Error fetching venues by profile name:", error);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      fetchBookingsByProfileName(name);
      fetchVenuesByProfileName(name); // Fetch venues when the component mounts
    } else {
      console.error("'name' is missing from localStorage.");
  } }, []);


  const handleAvatarChange = (e) => {
    const imageUrl = e.target.value;
    setAvatar(imageUrl);
  };

  const handleVenueManagerChange = (e) => {
    setIsVenueManager(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const name = localStorage.getItem("name");
      const token = localStorage.getItem("accessToken");
      console.log("Retrieved from localStorage - Name:", name, "accessToken:", token);

      if (!name || !token) {
        console.error("Name or token is missing.");
        return;
      }

      // Update venueManager status
      const venueManagerResponse = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ venueManager: isVenueManager }),
      });

      if (!venueManagerResponse.ok) {
        throw new Error("Failed to update venue manager status");
      }

      // Update avatar
      const avatarResponse = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${name}/media`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatar }),
      });

      if (!avatarResponse.ok) {
        const errorDetails = await avatarResponse.json();
        console.error("Failed to update avatar:", errorDetails);
        throw new Error("Failed to update avatar");
      }

      // Update local state
      const updatedUserInfo = await avatarResponse.json();
  setUserInfo(updatedUserInfo);
  updateLocalStorageUserData(updatedUserInfo);


    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const fetchBookingDetails = async (bookingId, accessToken) => {
    try {
      const response = await fetch(
        `https://api.noroff.dev/api/v1/holidaze/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to fetch booking details for ID:", bookingId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      return null;
    }
  };

  const fetchBookingsByProfileName = async (profileName) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Access token is missing.");
        return;
      }

      const response = await fetch(
        `https://api.noroff.dev/api/v1/holidaze/profiles/${profileName}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const bookings = await response.json();
        const detailedBookings = await Promise.all(
          bookings.map(async (booking) => {
            const details = await fetchBookingDetails(booking.id, accessToken);
            return { ...booking, details };
          })
        );
        setBookings(detailedBookings);
      } else {
        console.error("Failed to fetch bookings by profile name.");
      }
    } catch (error) {
      console.error("Error fetching bookings by profile name:", error);
    }
  };

  

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const { name } = userData;
      setUserInfo(userData);
      setIsVenueManager(userData.venueManager);
      fetchBookingsByProfileName(name);
      fetchVenuesByProfileName(name);
    } else {
      console.error("User data is missing from localStorage.");
    }
  }, []);

  const updateLocalStorageUserData = (updatedUserData) => {
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const startEditingVenue = (venueId) => {
    setEditingVenueId(venueId);
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = indexOfLastBooking >= bookings.length || bookings.length === 0;


  const handleVenueClick = async (id, e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${id}`);
      if (response.ok) {
        const venueData = await response.json();
      
        if (venueData.id) {
          
          const venueUrl = `/venues/${venueData.id}`;
          window.location.href = venueUrl; // Redirect to the venue page
        } else {
          console.error("Venue ID not found.");
        }
      } else {
        console.error("Failed to fetch venue data");
      }
    } catch (error) {
      console.error("Error fetching venue data:", error);
    }
  };

  const onVenueUpdated = () => {
    setEditingVenueId(null);
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.name) {
      fetchVenuesByProfileName(userData.name);
    }
  };

  

  return (
    <div className="my-24 profile-container">
      <div className="mx-auto mt-8 p-4 bg-white rounded shadow-xl w-[90%] max-w-[600px]">
        <h1 className="text-2xl primary-color font-bold mb-4">My Profile</h1>
        <div className="grid sm:flex sm:justify-between sm:items-center">
          <div className="topcontainer-profile">
          <div className="avatar">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt="Current Avatar"
                className="w-24 h-24 object-cover rounded border-2 "
              />
            ) : (
              <span className="text-gray-500">No avatar selected</span>
            )}
          </div>
            <div className="mb-2">
              <label className="block font-medium">Name:</label>
              <p className="text-lg font-semibold">
                {userInfo?.name || "Name Not Found"}
              </p>
            </div>
            <div className="mb-2">
              <label className="block font-medium">Email:</label>
              <p className="text-lg font-semibold">{userInfo?.email}</p>
            </div>
          </div>
          
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <label className="block font-medium mb-2 avatar">Avatar URL:</label>
            <input
              required
              type="text"
              placeholder={userInfo?.avatar || ""}
              onChange={handleAvatarChange}
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Venue Manager:</label>
            <input
              type="checkbox"
              checked={isVenueManager}
              onChange={handleVenueManagerChange}
              className="mr-2"
            />
            <span className="text-sm">Are you a venue manager?</span>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save
          </button>
        </form>
       
      </div>
      <div className="max-w-[600px] mx-auto mt-8 p-4 bg-white rounded shadow-xl w-[90%]">
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Upcoming Bookings</h2>
          <div className="flex justify-center items-center">
            {currentBookings.length > 0 ? (
              <ul className="list-disc list-inside">
                {currentBookings.map((booking) => (
                  <li key={booking.id} className="mb-4 flex items-center gap-4 border-b h-48">
                    {/* Display venue image if available */}
                    {booking.details && booking.details.media && booking.details.media.length > 0 && (
                      <img
                      src={booking.details.media[0]}
                      alt="Booking Media"
                        className="w-24 h-24 object-cover rounded border-2 mr-4"
                      />
                    )}
                    {/* Display booking details */}
                    <div className="w-full bookingDetails">
                    <img src={booking.media !== 'N/A' ? booking.media : 'https://via.placeholder.com/400'} alt={booking.description}  className="w-24 h-24 object-cover rounded border-2 mr-4"/>
                      <p className="text-gray-300">
                        Venue: {booking.id || "Venue Name Not Available"}
                      </p>
                      <p className="text-gray-300">
                        Date From: {booking.details ? new Date(booking.details.dateFrom).toLocaleDateString() : "N/A"}
                      </p>
                      <p className="text-gray-300">
                        Date To: {booking.details ? new Date(booking.details.dateTo).toLocaleDateString() : "N/A"}
                      </p>
                      <p className="text-gray-600 mb-4">Guests: {booking.details ? booking.details.guests : "N/A"}</p>
                      
    
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No bookings found for the customer.</p>
            )}
          </div>
          {/* Pagination controls */}
          {bookings.length > bookingsPerPage && (
            <div className="flex justify-center mt-4">
              <button
                onClick={previousPage}
                className={`bg-blue-500 text-white py-2 px-4 rounded w-24 ${isFirstPage ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isFirstPage}
              >
                Previous
              </button>
              <p className="text-gray-600 mx-2">
                Page {currentPage} of {Math.ceil(bookings.length / bookingsPerPage)}
              </p>
              <button
                onClick={nextPage}
                className={`bg-blue-500 text-white py-2 px-4 rounded w-24 ${isLastPage ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLastPage}
              >
                Next
              </button>
            </div>
          )}
           <Create token={localStorage.getItem("accessToken")} onBookingCreated={handleNewBooking} />
        </div>
      </div>
      <div className="max-w-[600px] mx-auto mt-8 p-4 bg-white rounded shadow-xl w-[90%]">
      <div className="mt-8">
        <h2 className="text-sm font-semibold mb-2">Venues Created</h2>
        <div className="flex justify-center items-center">
          {venues.length > 0 ? (
            <ul className="list-disc list-inside">
              {venues.map((venue) => (
                <li key={venue.id} className="mb-4">
                  <div className="w-full venueDetails">
                  <p className="text-gray-600">Name: {venue.name}</p>
                  <p>Description: {venue.description}</p>
                  <img src={venue.media !== 'N/A' ? venue.media : 'https://via.placeholder.com/400'} alt={venue.description}  className="w-24 h-24 object-cover rounded border-2 mr-4"/>
                  <p>Price: {venue.price},-</p>
                  <p>Max Guests: {venue.maxGuests}</p>
                  <p>Rating: {venue.rating}</p>
                  <p>Created: {venue.created}</p>
                  <p>Updated: {venue.updated}</p>
                  <p>Wifi: {venue.meta ? venue.meta.wifi : 'Wifi is not available'}</p>
                  <p>Parking: {venue.meta ? venue.meta.parking : 'Parking is not available'}</p>
                  <p>Breakfast: {venue.meta ? venue.meta.breakfast : 'Breakfast is not available'}</p>
                  <p>Pets: {venue.meta ? venue.meta.pets : 'Pets is not available'}</p>
                  <p>Address: {venue.location ? venue.location.address : 'Address not available'}</p>
                  <p>City: {venue.location ? venue.location.city : 'City not available'}</p>
                  <p>Zip: {venue.location ? venue.location.zip : 'Zip not available'}</p>
                  <p>Country: {venue.location ? venue.location.country : 'Country not available'}</p>
                  <p>Continent: {venue.location ? venue.location.continent : 'Continent not available'}</p>
                  <p>Lat: {venue.location ? venue.location.lat : 'Lat not available'}</p>
                  <p>Lng: {venue.location ? venue.location.lng : 'Lng not available'}</p>
                  </div>
                  <button
                    onClick={() => startEditingVenue(venue.id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                  >
                    Edit Venue
                  </button>
                  <Bookings token={token} />
                </li>
              ))}
               
            </ul>
            
          ) : (
            <p className="text-gray-500">No venues found for the profile.</p>
          )}
        </div>
        {editingVenueId && (
          <Update
            accessToken={localStorage.getItem('accessToken')}
            id={editingVenueId}
            onUpdated={onVenueUpdated}
          />
        )}
      </div>
      </div>
    </div>
  );
};

export default Profile;






