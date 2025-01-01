"use client";
import Rating from "@/app/(teacher)/components/RatingBar/Rating";
import { useDebounce } from "@/app/hooks/useDebounce";
import { SearchCourseParams } from "@/app/types/course";
import { labels } from "@/app/utils/labels";
import { FormControlLabel, Radio, RadioGroup, Slider } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

function formatToVND(amount: number): string {
  return `${amount.toLocaleString("vi-VN")} đ`;
}

export default function FilterBar({
  setSearchFilter,
}: {
  setSearchFilter: React.Dispatch<React.SetStateAction<SearchCourseParams>>;
}) {
  const searchParams = useSearchParams();
  const iniLabel = searchParams.get("label") || "";
  const [value, setValue] = useState<number[]>([0, 10000000]);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState<string>("");

  // Debounce the price range value
  const debouncedValue = useDebounce(value, 300);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  useEffect(() => {
    setSearchFilter((prev) => ({
      ...prev,
      label: category,
      rating: Number(rating),
      priceFrom: debouncedValue[0], // Use debounced value here
      priceTo: debouncedValue[1], // Use debounced value here
    }));
  }, [category, rating, debouncedValue]);
  useEffect(() => {
    if (iniLabel) {
      setCategory(iniLabel);
    }
  }, [iniLabel]);
  return (
    <div className="rounded-lg border-[1px] px-4 py-4">
      <div className="mb-4 w-full text-center text-2xl font-bold">Filter</div>
      <p className="mb-2 font-semibold">Price range</p>
      <div className="px-6">
        <Slider
          getAriaLabel={() => "Price range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000000}
          step={100000}
        />
      </div>
      <div className="flex justify-between">
        <div className="min-w-[80px] rounded-md border-[1px] px-2 py-1 text-center text-sm">
          {formatToVND(value[0])}
        </div>
        <div className="min-w-[80px] rounded-md border-[1px] px-2 py-1 text-center text-sm">
          {formatToVND(value[1])}
        </div>
      </div>
      <p className="mb-2 mt-4 font-semibold">Course Categories</p>
      <div className="flex flex-wrap gap-2">
        {labels.map((label, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (label === category) {
                setCategory("");
              } else {
                setCategory(label);
              }
            }}
            className={`${
              category === label
                ? "border-blue-200 bg-blue-200 text-blue-600"
                : "hover:bg-gray-200"
            } cursor-pointer rounded-[4px] border-[1px] px-4 py-1`}
          >
            {label}
          </div>
        ))}
      </div>
      <p className="mt-4 font-semibold">Rating</p>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      >
        {[4, 3, 2, 1, 0].map((rate) => (
          <FormControlLabel
            key={rate}
            value={rate.toString()} // Value must be a string
            control={<Radio size="small" />}
            label={
              <div className="flex items-center gap-2">
                <Rating rating={rate} className="text-lg" />
                <p className="text-sm">From {rate} star</p>
              </div>
            }
          />
        ))}
      </RadioGroup>
    </div>
  );
}
