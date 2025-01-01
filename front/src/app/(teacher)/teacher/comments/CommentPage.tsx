"use client";
import { getCommentsByCourseId } from "@/app/api/comments";
import { getAllCourse } from "@/app/api/course";
import { useAuth } from "@/app/component/authProvider";
import { ICourse } from "@/app/types/course";
import { MenuItem, Pagination, Select } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import CommentSection from "./CommentSection";

export default function CommentPage() {
  const { user } = useAuth();
  const [courseSlt, setCourseSlt] = useState(0);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("-createdAt");
  const { data } = useQuery({
    queryKey: ["courses", {}],
    queryFn: () =>
      getAllCourse(1, 1000, "-createdAt", "", 0, "", 0, 10000000, user?.id),
    enabled: !!user?.id,
  });
  const courses = data?.data || [];
  const { data: commentsRes } = useQuery({
    queryKey: [
      "comments",
      { courseId: courses[courseSlt]?._id, sortBy: order, page: page },
    ],
    queryFn: () =>
      getCommentsByCourseId(page, 5, courses[courseSlt]?._id, order),
    enabled: !!courses[courseSlt]?._id,
  });
  const totalPages = commentsRes?.pagination?.total_pages || 0;
  const comments = commentsRes?.data || [];

  return (
    <div>
      <p className="text-2xl font-bold">Comments</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p>Course:</p>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            value={courseSlt}
            size="small"
            placeholder="Select course"
            onChange={(e) => {
              setCourseSlt(e.target.value as number);
            }}
          >
            {courses.map((course, idx) => (
              <MenuItem key={idx} value={idx}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </div>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={order}
          size="small"
          onChange={(v) => setOrder(v.target.value)}
        >
          <MenuItem value={"-createdAt"}>Newest</MenuItem>
          <MenuItem value={"createdAt"}>Oldest</MenuItem>
          <MenuItem value={"rating"}>Top Rating</MenuItem>
        </Select>
      </div>
      <div className="mt-8"></div>
      <CommentSection comments={comments} />
      <div className="mt-8 flex justify-center">
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
