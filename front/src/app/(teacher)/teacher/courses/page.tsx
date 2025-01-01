"use client";
import { getAllCourse } from "@/app/api/course";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { convertISOToDate } from "@/app/utils/coverter";
import AddCourseButton from "./components/AddCourseModal";
import { Pagination } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Link from "next/link";
import { useAuth } from "@/app/component/authProvider";
const LIMIT = 4;
function formatToVND(amount: number): string {
  return `${amount.toLocaleString("vi-VN")} đ`;
}

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("-createdAt");
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["courses", { page: page, limit: LIMIT, order: sortBy }],
    queryFn: () =>
      getAllCourse(page, LIMIT, sortBy, "", 0, "", 0, 10000000, user?.id),
    enabled: !!user?.id,
  });
  const courses = data?.data || [];
  const totalPages = data?.pagination?.total_pages;
  return (
    <div className="min-h-[120vh] px-6">
      <div className="flex items-center justify-between">
        <div className="my-4 text-lg font-bold">Course List</div>
        <AddCourseButton />
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "5%" }} align="center">
                No
              </TableCell>
              <TableCell sx={{ width: "30%" }} align="left">
                <div
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() =>
                    setSortBy((prev) => {
                      if (prev === "title") {
                        return "-title";
                      } else return "title";
                    })
                  }
                >
                  <p>Name</p>
                  {sortBy === "title" && <ExpandMoreIcon />}
                  {sortBy === "-title" && <ExpandLessIcon />}
                </div>
              </TableCell>
              <TableCell sx={{ width: "15%" }} align="center">
                Total lessons
              </TableCell>
              <TableCell sx={{ width: "15%" }} align="center">
                <div
                  className="flex cursor-pointer items-center justify-center gap-1"
                  onClick={() =>
                    setSortBy((prev) => {
                      if (prev === "createdAt") {
                        return "-createdAt";
                      } else return "createdAt";
                    })
                  }
                >
                  <p>Created date</p>
                  {sortBy === "createdAt" && <ExpandMoreIcon />}
                  {sortBy === "-createdAt" && <ExpandLessIcon />}
                </div>
              </TableCell>
              <TableCell sx={{ width: "15%" }} align="center">
                <div
                  className="flex cursor-pointer items-center justify-center gap-1"
                  onClick={() =>
                    setSortBy((prev) => {
                      if (prev === "rating") {
                        return "-rating";
                      } else return "rating";
                    })
                  }
                >
                  <p>Rating</p>
                  {sortBy === "rating" && <ExpandMoreIcon />}
                  {sortBy === "-rating" && <ExpandLessIcon />}
                </div>
              </TableCell>
              <TableCell sx={{ width: "10%" }} align="center">
                <div
                  className="flex cursor-pointer items-center justify-center gap-1"
                  onClick={() =>
                    setSortBy((prev) => {
                      if (prev === "price") {
                        return "-price";
                      } else return "price";
                    })
                  }
                >
                  <p>Price</p>
                  {sortBy === "price" && <ExpandMoreIcon />}
                  {sortBy === "-price" && <ExpandLessIcon />}
                </div>
              </TableCell>
              <TableCell sx={{ width: "10%" }} align="center">
                Detail
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course, idx) => (
              <TableRow
                key={course._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {idx + 1}
                </TableCell>
                <TableCell align="left">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-[75px] w-[75px] overflow-hidden rounded-md bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${course.cover})` }}
                    ></div>
                    <div className="text-[16px] font-semibold">
                      {course.title}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="center">{course.lessonIds.length}</TableCell>
                <TableCell align="center">
                  {convertISOToDate(course.createdAt)}
                </TableCell>
                <TableCell align="center">
                  {course.rating.toFixed(1)}/5
                </TableCell>
                <TableCell align="center">
                  {formatToVND(course.price)}
                </TableCell>
                <TableCell align="center">
                  <Link href={`/teacher/courses/${course._id}`}>
                    <OpenInNewIcon className="cursor-pointer" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
