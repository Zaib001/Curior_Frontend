import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const RatingStars = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  const starStyle = (value) => ({
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    color: (hover || rating) >= value ? '#facc15' : '#d1d5db',
  });

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
      {[1, 2, 3, 4, 5].map((value) => (
        <FaStar
          key={value}
          size={26}
          style={starStyle(value)}
          onClick={() => setRating(value)}
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
    </div>
  );
};

export default RatingStars;
