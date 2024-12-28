import { ILesson } from "@/app/types/lesson";
import React from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ChecklistIcon from "@mui/icons-material/Checklist";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
export default function LessonList({
  lessons,
  lessonSlt,
  setShowLessonList,
}: {
  lessons: ILesson[];
  lessonSlt: number;
  setShowLessonList: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="min-h-[100vh] border-l-[1px]">
      <div className="relative flex items-center justify-center border-b-[1px] py-4">
        <div
          onClick={() => setShowLessonList(false)}
          className="absolute left-[10px] top-[50%] translate-y-[-50%] cursor-pointer"
        >
          <CloseIcon />
        </div>
        <p className="text-lg font-semibold">Curriculum</p>
      </div>
      {lessons.map((lesson, idx) => {
        return (
          <Link
            href={`?lessonIdx=${idx}`}
            key={idx}
            className={`${lessonSlt === idx ? "bg-gray-200" : ""} flex cursor-pointer gap-2 border-b-[1px] px-4 py-4 transition-all hover:bg-gray-200`}
          >
            {lesson.type === "video" && <PlayCircleIcon />}
            {lesson.type === "testselection" && <ChecklistIcon />}
            <p>{lesson.title}</p>
          </Link>
        );
      })}
    </div>
  );
}
