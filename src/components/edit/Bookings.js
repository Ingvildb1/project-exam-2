import React, { useState, useEffect } from 'react';

const Bookings = ({ accessToken, id }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`https://api.noroff.dev/api/v1/holidaze/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const bookingsData = await response.json();
          setBookings([bookingsData]); 
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (id) {
      fetchBookings();
    }
  }, [id, accessToken]);

  return (
    <div>
      <h1>Your Bookings</h1>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              <p>Date From: {booking.dateFrom}</p>
              <p>Date To: {booking.dateTo}</p>
              <p>Guests: {booking.guests}</p>
              {/* Add more booking details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default Bookings;

