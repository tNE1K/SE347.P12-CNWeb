import React from "react";
import StarIcon from "@mui/icons-material/Star";

export default function RatingPicker({
  rating,
  setRating,
}: {
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((el, idx) => {
          return (
            <StarIcon
              key={el}
              onClick={() => setRating(el)}
              className={`cursor-pointer text-2xl ${rating >= el ? "text-yellow-500" : "text-gray-500"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
