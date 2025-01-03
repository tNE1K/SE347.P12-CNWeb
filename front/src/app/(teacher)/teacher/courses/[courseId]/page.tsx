"use client";
import { deleteCourse, getCourseById } from "@/app/api/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Rating from "@/app/(teacher)/components/RatingBar/Rating";
import { Button, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { EditCourseModal } from "../components/EditCourseModal";
import { toast } from "react-toastify";
import CustomDialog from "../components/CustomDialog";
import LessonInfo from "./LessonInfo";
export default function page() {
  const params = useParams<{ courseId: string }>();
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data } = useQuery({
    queryKey: ["course-detail", { courseId: params.courseId }],
    queryFn: () => getCourseById(params.courseId),
  });
  const { mutate } = useMutation({
    mutationFn: (courseId: string) => {
      return deleteCourse(courseId);
    },
    onSuccess: () => {
      toast.success("Delete course successfully!");
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error?.message || "Something went wrong"}`);
    },
  });
  const handleDeleteCourse = () => {
    mutate(params.courseId);
    router.push("/teacher/courses");
  };
  const toggle = () => setShowEditModal((prev) => !prev);
  const course = data?.data || undefined;
  if (!course) return <></>;
  return (
    <div className="flex flex-col gap-6 px-8 py-8">
      <div className="flex gap-8">
        <div
          className="h-[200px] w-[300px] rounded-lg border-[1px] bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${course.cover})` }}
        ></div>
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-semibold">{course.title}</p>
          <p className="mb-1 text-sm font-semibold text-gray-500">
            {course.description}
          </p>
          <div className="flex items-center gap-2">
            <Rating
              rating={course.rating}
              className="text-xl"
              parentClass="text-sm"
            />
            <p className="text-sm font-semibold text-gray-400">
              {course.rating.toFixed(1)} / 5
            </p>
          </div>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ textTransform: "none" }}
            onClick={toggle}
            className="mt-2 max-w-[200px]"
          >
            Edit course
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => setShowDeleteDialog(true)}
            className="mt-2 max-w-[200px]"
          >
            Delete course
          </Button>
        </div>
        <EditCourseModal
          open={showEditModal}
          toggle={toggle}
          iniCourse={course}
        />
        <CustomDialog
          title="Are you sure want to delete this course!"
          desc="Your course and all lessons inside will be delete. Are you sure to continue"
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onYes={() => handleDeleteCourse()}
        />
      </div>
      <LessonInfo course={course} />
    </div>
  );
}
