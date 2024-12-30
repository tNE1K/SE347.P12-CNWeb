import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
const Rating = ({
  rating = 0,
  maxRating = 5,
  className = "",
  parentClass = "",
}) => {
  const ratings = Array.from({ length: maxRating }, (_, index) => {
    if (index < Math.floor(rating)) {
      return (
        <StarIcon key={index} className={`text-yellow-400 ${className}`} />
      ); // Filled star
    } else if (index === Math.floor(rating) && rating % 1 !== 0) {
      return (
        <StarHalfIcon key={index} className={`text-yellow-400 ${className}`} />
      ); // Half star
    } else {
      return (
        <StarBorderIcon
          key={index}
          className={`text-yellow-400 ${className}`}
        />
      ); // Outline star
    }
  });
  return <div className={`flex ${parentClass}`}>{ratings}</div>;
};

export default Rating;
