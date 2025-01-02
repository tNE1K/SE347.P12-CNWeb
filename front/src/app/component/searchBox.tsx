import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { TextField, Typography } from "@mui/material";
import { getAllCourse } from "../api/course";
import { ICourse } from "../types/course";
import Rating from "../(teacher)/components/RatingBar/Rating";

export default function SearchBox({
  setKeyword,
}: {
  setKeyword?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [searchField, setSearchField] = useState<string>("");
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [open, setOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const fetchCourses = useCallback(
    debounce(async (keyword: string) => {
      try {
        const response = await getAllCourse(1, 3, "createdAt", keyword);
        if (response?.data) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }, 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchField(keyword);
    if (keyword.trim()) {
      setOpen(true);
      fetchCourses(keyword);
    } else {
      setOpen(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBoxRef.current &&
      !searchBoxRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (setKeyword) setKeyword(searchField);
  }, [setKeyword, searchField]);
  return (
    <div className="relative flex-1" ref={searchBoxRef}>
      <TextField
        id="outlined-search"
        label="Find your course"
        type="search"
        autoComplete="off"
        className="w-full"
        value={searchField}
        onChange={handleSearchChange}
      />
      {open && (
        <div className="absolute w-full rounded-[8px] bg-white shadow-lg">
          {courses.length > 0 &&
            courses.map((el, idx) => {
              return (
                <div
                  className="flex cursor-pointer items-center gap-4 rounded-md p-2 transition-all hover:bg-gray-200"
                  key={idx}
                >
                  <div
                    style={{ backgroundImage: `url(${el.cover})` }}
                    className="h-[70px] w-[70px] rounded-md border-[1px] bg-cover bg-center bg-no-repeat"
                  ></div>
                  <div>
                    <p className="font-bold">{el.title}</p>
                    <p className="text-sm text-gray-600">{el.description}</p>
                    <div className="flex items-center gap-2">
                      <Rating rating={el.rating} className="text-sm" />
                      <p className="text-sm text-gray-600">{el.rating}/5</p>
                    </div>
                  </div>
                </div>
              );
            })}
          {courses.length === 0 && (
            <div className="mt-[80px] flex min-h-[160px] justify-center">
              No course found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
