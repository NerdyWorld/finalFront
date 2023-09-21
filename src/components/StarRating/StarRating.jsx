import React from 'react';


const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <span
        className="rating-revieww"
          key={index}
          onClick={() => onRatingChange(index + 1)}
          style={{
            color: index < rating ? "gold" : "grey",
            cursor: "pointer"
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;