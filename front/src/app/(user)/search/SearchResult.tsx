import CourseCard from "@/app/component/courseCard";
import { ICourse } from "@/app/types/course";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function SearchResult({ courses }: { courses: ICourse[] }) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("kw") || "";
  const [sortBy, setSortBy] = useState("-createdAt");

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {courses.map((course, idx) => {
          return <CourseCard key={idx} course={course}></CourseCard>;
        })}
      </div>
    </div>
  );
}
