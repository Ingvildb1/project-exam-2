import React from 'react';
import { Link } from 'react-router-dom';
import './../App.css';

const VenueCard = ({ venue }) => {
  return (
    <div className='venue'>
      <div className="venueImg">
        <img src={venue.media !== 'N/A' ? venue.media : 'https://via.placeholder.com/400'} alt={venue.description} />
      </div>
      <div>
        <p>{venue.name}</p>
        <p>Price: {venue.price},-</p>
        <Link to={`/specific/${venue.id}`}>
          <button>Show Venue</button>
        </Link>
      </div>
    </div>
  );
};

export default VenueCard;
