"use client";
import { Typography } from "@mui/material";
import React from "react";
import StatBox from "./StatBox";
import GroupsIcon from "@mui/icons-material/Groups";
import { useQuery } from "@tanstack/react-query";
import { getCourseCount, getUserEnrollCount } from "@/app/api/course";
import { useAuth } from "@/app/component/authProvider";
import MonthlyUserChart from "./UserEnrollCourseChart";
import CourseCountChart from "./CourseCountChart";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["usersEnroll", { teacherId: user?.id }],
    queryFn: () => getUserEnrollCount(user?.id),
    enabled: !!user?.id,
  });
  const { data: courseData } = useQuery({
    queryKey: ["coursesCount", { teacherId: user?.id }],
    queryFn: () => getCourseCount(user?.id),
    enabled: !!user?.id,
  });
  const totalUniqueUsers = data?.totalUniqueUsersEnroll || 2;
  const userEnrollData = data?.data || [];
  const totalCourses = courseData?.totalCourses || 0;
  const courseCountData = courseData?.data || [];
  return (
    <div className="mt-8 min-h-[120vh] px-6">
      <Typography variant="h5" className="mb-6 font-bold text-gray-800">
        Course stats
      </Typography>
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox
          title={totalUniqueUsers.toString()}
          subtitle="Total paticipants"
          progress={0.9}
          increase="+12%"
          icon={<GroupsIcon className="text-4xl text-green-500" />}
        />
        <StatBox
          title={totalCourses.toString()}
          subtitle="Total courses"
          progress={0.5}
          increase="+45%"
          icon={<LibraryBooksIcon className="text-4xl text-blue-500" />}
        />
      </div>
      <div className="mt-6 flex gap-4">
        <div className="flex h-[400px] min-w-[50%] basis-[50%] flex-col gap-4 rounded-[4px] border-[1px] border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">User enroll course line</p>
          </div>
          <MonthlyUserChart data={userEnrollData} />
        </div>
        <div className="flex w-[50%] basis-[50%] flex-col items-center gap-4 rounded-[4px] border-[1px] border-gray-300 p-4">
          <p className="text-2xl font-bold">Number of courses</p>
          <CourseCountChart data={courseCountData} />
        </div>
      </div>
    </div>
  );
}
