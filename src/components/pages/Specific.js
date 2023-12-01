import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './../../App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

const Specific = ({ onBookingSuccess }) => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [bookingDates, setBookingDates] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Function to render star ratings
  const renderStars = (rating) => {
    if (rating > 0) {
      return <span style={{ color: 'gold' }}>{'★'.repeat(rating)}</span>;
    } else {
      return <span style={{ color: 'black', fontSize: '13px' }}>No ratings yet</span>;
    }
  };
  const userLoggedIn = Boolean(localStorage.getItem('accessToken'));

  const fetchVenue = async () => {
    try {
      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/venues/${id}`);
      const data = await response.json();
      setVenue(data);
    } catch (error) {
      console.error('Error fetching venue:', error);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleGuestsChange = (event) => {
    const updatedGuests = parseInt(event.target.value);
    if (updatedGuests >= 1) {
      setGuests(updatedGuests);
    }
  };

  const handleBookClick = async () => {
    console.log("Booking attempt started"); // Log when booking attempt starts

    if (!userLoggedIn) {
      console.log("User not logged in");
      toast.error('Please log in to make a booking.');
      return;
    }

    console.log("Booking dates and guests:", startDate, endDate, guests); // Log the booking details

    if (startDate && endDate && guests > 0) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const name = localStorage.getItem('name');

        console.log("Access token and name:", accessToken, name); // Log access token and name

        if (!startDate || !endDate || guests <= 0) {
          console.log("Invalid booking data", { startDate, endDate, guests });
          toast.error('Please select a valid date range and number of guests.');
          return;
        }

        const bookingData = {
          venueId: id,
          dateFrom: startDate.toISOString(),
          dateTo: endDate.toISOString(),
          guests: guests,
          profileName: name,
        };

        console.log("Sending booking data:", bookingData); // Log the booking data being sent

        const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(bookingData),
        });

        console.log("Booking response status:", response.status); // Log the response status

        if (response.status === 401) {
          console.error('User is not authorized.');
          return;
        }

        if (response.ok) {
          toast.success('Booking successful!');
          setBookingSuccess(true);
          onBookingSuccess(); 
          fetchBookingDates();
        } else {
          toast.error('Booking failed.');
        }
      } catch (error) {
        console.error('Error creating booking:', error);
      }
    } else {
      toast.error('Please select a valid date range and number of guests.');
    }
  };

  const fetchBookingDates = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const name = localStorage.getItem('name');

      if (!accessToken || !name) {
        console.error('Access token or name is missing.');
        return;
      }

      const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/bookings`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        console.error('User is not authorized.');
        // Handle unauthorized user here, e.g., redirect to login
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const availableDates = data.map((booking) => ({
            startDate: new Date(booking.dateFrom),
            endDate: new Date(booking.dateTo),
          }));
          setBookingDates(availableDates);
        } else {
          console.error('API did not return an array:', data);
          setBookingDates([]);
        }
      } else {
        console.error('Failed to fetch booking dates. Status:', response.status);
        console.error('Response:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching booking dates:', error);
    }
  };

  useEffect(() => {
    fetchBookingDates(); // Fetch booking dates first
    fetchVenue(); // Then fetch venue data
  }, [id]);

  return (
    <div className="specific-container">
      <h2>Specific Venue</h2>
      {venue ? (
        <div className="venueSpecific">
          <div className='venueinfotop'>
            <div className="venueImg">
              <img src={venue.media !== 'N/A' ? venue.media : 'https://via.placeholder.com/400'} alt={venue.description} />
            </div>
            <div className="venue-info">
              <h3>{venue.name}</h3>
              <p>Price: {venue.price},-</p>
            </div>
            {/* Display the star rating */}
          <div className="venue-rating">
            <p>{renderStars(venue.rating)}</p>
          </div>
          </div>

          <div className='booking'>
        <p className="text-gray-600">Select Dates:</p>
        <div className="date-picker-container">
          <div>
            <p className="text-gray-600">Check-in:</p>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsStart
              minDate={new Date()}
              filterDate={(date) =>
                date >= new Date() &&
                (!bookingDates.some(
                  (bookingDate) =>
                    date >= new Date(bookingDate.startDate) && date <= new Date(bookingDate.endDate)
                ) ||
                (startDate &&
                  endDate &&
                  date >= startDate &&
                  date <= endDate &&
                  bookingDates.every(
                    (bookingDate) =>
                      date < new Date(bookingDate.startDate) ||
                      date > new Date(bookingDate.endDate)
                  )))
              }
              dateFormat="yyyy-MM-dd"
              isClearable
              className="ml-2"
            />
          </div>
          <div className="ml-2">
            <p className="text-gray-600">Check-out:</p>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsEnd
              minDate={startDate}
              filterDate={(date) =>
                date >= new Date() &&
                (!bookingDates.some(
                  (bookingDate) =>
                    date >= new Date(bookingDate.startDate) && date <= new Date(bookingDate.endDate)
                ) ||
                (startDate &&
                  endDate &&
                  date >= startDate &&
                  date <= endDate &&
                  bookingDates.every(
                    (bookingDate) =>
                      date < new Date(bookingDate.startDate) ||
                      date > new Date(bookingDate.endDate)
                  )))
              }
              dateFormat="yyyy-MM-dd"
              isClearable
              className="ml-2"
            />
          </div>
        </div>

        <div className="guests-input">
          <label className="text-gray-600">Guests:</label>
          <input
            required
            type="number"
            min={1}
            max={venue ? venue.maxGuests : 1}
            value={guests}
            onChange={handleGuestsChange}
          />
        </div>

        {startDate && endDate && guests >= 1 && (
          <div className="selected-dates">
            <p className="text-gray-600">
              Selected Dates: {startDate.toDateString()} - {endDate.toDateString()}
            </p>
            <p className="text-gray-600">Number of Guests: {guests}</p>
          </div>
        )}

        <button
          onClick={handleBookClick}
          disabled={!startDate || !endDate || guests < 1 || !userLoggedIn}
          className="book-now-button"
        >
          Book Now
        </button>
        
        {bookingSuccess && (
        <p className="success-message">Your booking has been successfully made!</p>
      )}

        {!userLoggedIn && (
        <p className="error-message">Please log in to make a booking.</p>
      )}
      </div>

          <div className='detailsContainer'>
            <div className='location'>
              <h2>Location</h2>
              <p>Address: {venue.location ? venue.location.address : 'Address not available'}</p>
              <p>City: {venue.location ? venue.location.city : 'City not available'}</p>
              <p>Zip: {venue.location ? venue.location.zip : 'Zip not available'}</p>
              <p>Country: {venue.location ? venue.location.country : 'Country not available'}</p>
              <p>Continent: {venue.location ? venue.location.continent : 'Continent not available'}</p>
            </div>
            <div className='details'>
              <h2>Details</h2>
              <p>Created: {venue.created}</p>
              <p>Updated: {venue.updated}</p>
              <p>Max Guests: {venue.maxGuests}</p>
              <p>WiFi: {venue.meta ? (venue.meta.wifi ? 'Yes' : 'No') : 'WiFi not available'}</p>
              <p>Parking: {venue.meta ? (venue.meta.parking ? 'Yes' : 'No') : 'Parking not available'}</p>
              <p>Breakfast: {venue.meta ? (venue.meta.breakfast ? 'Yes' : 'No') : 'Breakfast not available'}</p>
              <p>Pets: {venue.meta ? (venue.meta.pets ? 'Allowed' : 'Not allowed') : 'Pets not specified'}</p>
            </div>
          </div>
        </div>
      ) : null}
      
    </div>
  );
};

export default Specific;










