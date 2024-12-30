import Rating from "@/app/(teacher)/components/RatingBar/Rating";
import { ILesson } from "@/app/types/lesson";
import { convertISOToDate } from "@/app/utils/coverter";
import React from "react";
import CommentSection from "./CommentSection";
export default function LessonInfo({ lesson }: { lesson: ILesson }) {
  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{lesson.title}</p>
          <p className="text-sm text-gray-500">
            {convertISOToDate(lesson.createdAt)}
          </p>
          <p className="text-gray-500">{lesson.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="ml-2">
            <Rating className="text-xl" rating={lesson.rating} />
          </div>
          <p>({lesson.numberRatings} ratings)</p>
        </div>
      </div>
      <CommentSection lessonId={lesson._id} />
    </div>
  );
}
