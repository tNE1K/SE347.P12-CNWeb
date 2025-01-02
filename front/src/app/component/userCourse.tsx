import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getUserEnrollCourse } from "../api/course";
import { useAuth } from "./authProvider";
import { Pagination } from "@mui/material";
import SearchResult from "../(user)/search/SearchResult";
import CourseCard from "./courseCard";

export default function UserCourse() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const { data } = useQuery({
    queryKey: ["courses", { page: page }],
    queryFn: () => {
      if (!user?.id) return Promise.resolve(null);
      return getUserEnrollCourse(user?.id, page, 4);
    },
    enabled: !!user?.id,
  });
  const totalPages = data?.pagination?.total_pages || 0;
  const courses = data?.data || [];
  return (
    <div className="basis-[78%]">
      {courses.length > 0 && (
        <div className="min-h-[500px]">
          <div className="grid grid-cols-4">
            {courses.map((course, idx) => (
              <CourseCard course={course} key={idx} isLearning />
            ))}
          </div>
        </div>
      )}
      {courses.length === 0 && (
        <div className="flex h-[400px] w-full items-center justify-center text-center text-lg">
          No result found
        </div>
      )}
      <div className="my-4 flex justify-center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => {
            setPage(value);
          }}
          variant="outlined"
          color="primary"
        />
      </div>
    </div>
  );
}
