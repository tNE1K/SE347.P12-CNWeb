"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import LessonList from "./LessonList";
import LessonViewer from "./LessonViewer";
import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "@/app/api/course";
import { useSearchParams } from "next/navigation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LessonInfo from "./LessonInfo";
export default function page() {
  const params = useParams<{ courseId: string }>();
  const searchParams = useSearchParams();
  const [lessonSlt, setLessonSlt] = useState(0);
  const [showLessonList, setShowLessonList] = useState(true);
  const lessonIdx = searchParams.get("lessonIdx");
  const { data } = useQuery({
    queryKey: ["course-detail", { courseId: params.courseId }],
    queryFn: () => getCourseById(params.courseId),
  });
  const course = data?.data || undefined;
  const lessons = course?.lessonIds;

  useEffect(() => {
    if (course?.lessonIds && course?.lessonIds.length > 0 && lessonIdx) {
      if (course?.lessonIds[Number(lessonIdx)]) {
        setLessonSlt(Number(lessonIdx));
      }
    }
  }, [course, lessonIdx]);
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
