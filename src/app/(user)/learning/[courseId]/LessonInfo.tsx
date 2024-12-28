import Rating from "@/app/(teacher)/components/RatingBar/Rating";
import { getCommentsByLessonId } from "@/app/api/comments";
import { ILesson } from "@/app/types/lesson";
import { convertISOToDate } from "@/app/utils/coverter";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import CommentSection from "./CommentSection";
const LIMIT = 10;
export default function LessonInfo({ lesson }: { lesson: ILesson }) {
  const [page, setPage] = useState(1);
  const { data } = useQuery({
    queryKey: ["comments", { page: page, limit: LIMIT, lessonId: lesson?._id }],
    queryFn: () => getCommentsByLessonId(page, LIMIT, lesson?._id),
  });
  const comments = data?.data || [];
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
      <CommentSection comments={comments} />
    </div>
  );
}
