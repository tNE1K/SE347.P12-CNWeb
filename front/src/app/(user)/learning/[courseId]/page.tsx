"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import LessonList from "./LessonList";
import LessonViewer from "./LessonViewer";
import { useQuery } from "@tanstack/react-query";
import { getCourseById, getCourseProgress } from "@/app/api/course";
import { useSearchParams } from "next/navigation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LessonInfo from "./LessonInfo";
import { useAuth } from "@/app/component/authProvider";
export default function page() {
  const params = useParams<{ courseId: string }>();
  const { user, setCourseSlt } = useAuth();
  const searchParams = useSearchParams();
  const [lessonSlt, setLessonSlt] = useState(0);
  const [showLessonList, setShowLessonList] = useState(true);
  const lessonIdx = searchParams.get("lessonIdx");
  const { data } = useQuery({
    queryKey: ["course-detail", { courseId: params.courseId }],
    queryFn: () => getCourseById(params.courseId),
  });
  const { data: progressRes } = useQuery({
    queryKey: ["course-progress", {}],
    queryFn: () => {
      if (!user?.id) return Promise.resolve(null);
      return getCourseProgress(params.courseId, user.id);
    },
    enabled: !!user?.id,
  });
  const progress = progressRes?.data || [];
  const course = data?.data || undefined;
  const lessons = course?.lessonIds;

  useEffect(() => {
    if (
      course?.lessonIds &&
      course?.lessonIds.length > 0 &&
      Number(lessonIdx) < course.lessonIds.length
    ) {
      if (course?.lessonIds[Number(lessonIdx)]) {
        setLessonSlt(Number(lessonIdx));
      }
    }
    if (course) {
      setCourseSlt(course);
    }
  }, [course, lessonIdx]);
  if (course?.lessonIds.length === 0)
    return (
      <div className="flex min-h-[90vh] items-center justify-center">
        Currently no lesson on this course
      </div>
    );
  return (
    <div className="flex">
      <div className="flex-1">
        {lessons && <LessonViewer lesson={lessons[lessonSlt]} />}
        {lessons && <LessonInfo lesson={lessons[lessonSlt]} />}
      </div>
      {showLessonList && (
        <div className="w-[25%]">
          {lessons && (
            <LessonList
              setShowLessonList={setShowLessonList}
              lessons={lessons}
              progress={progress}
              lessonSlt={lessonSlt}
            />
          )}
        </div>
      )}
      {!showLessonList && (
        <button
          onClick={() => setShowLessonList(true)}
          className="absolute right-0 top-1/3 -translate-y-1/2 transform rounded-l-lg bg-blue-500 px-2 py-2 text-white shadow-lg hover:bg-blue-600"
        >
          <ChevronLeftIcon />
        </button>
      )}
    </div>
  );
}
