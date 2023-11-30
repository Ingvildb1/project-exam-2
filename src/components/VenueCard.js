import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import './styles/styles.scss'

const VenueCard = ({ venue }) => {
  // Determine the rating content based on the venue's rating
  const ratingContent = venue.rating > 0 ? (
    '★'.repeat(venue.rating)
  ) : (
    <span className="no-rating">No ratings yet</span>
  );

  return (
    <div className='venue'>
      <div className="venueImg">
      <img
          src={venue.media !== 'N/A' ? venue.media : 'https://via.placeholder.com/400'}
          alt={venue.description}
        />
      </div>
      <div>
        <p>{venue.name}</p>
        <p>Price: {venue.price},-</p>
        <p className="rating"><span className="stars">{ratingContent}</span></p>
        <Link to={`/specific/${venue.id}`}>
          <button>Show Venue</button>
        </Link>
      </div>
    </div>
  );
};

export default VenueCard;
