"use client";
import { getAllCourse } from "@/app/api/course";
import { useQuery } from "@tanstack/react-query";
import React from "react";
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
const LIMIT = 4;
export default function CoursesPage() {
  const { data } = useQuery({
    queryKey: ["courses", { page: 1, limit: LIMIT }],
    queryFn: () => getAllCourse(1, LIMIT),
  });
  const courses = data?.data || [];

  return (
    <div className="h-[2000px] px-6">
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
              <TableCell sx={{ width: "40%" }} align="left">
                Name
              </TableCell>
              <TableCell sx={{ width: "15%" }} align="center">
                Total lessons
              </TableCell>
              <TableCell sx={{ width: "15%" }} align="center">
                Created date
              </TableCell>
              <TableCell sx={{ width: "15%" }} align="center">
                Rating
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
                <TableCell align="center">{course.rating}/5</TableCell>
                <TableCell align="center">
                  <OpenInNewIcon className="cursor-pointer" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
