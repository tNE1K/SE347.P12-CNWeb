import { IComment } from "../types/comment";
import { ResponseApi } from "../types/utils";
import request from "./request";
export interface CreateCommentPayload {
  lesson_id?: string;
  course_id?: string;
  user_id: string;
  content: string;
  rating: number;
}
export interface ReplyCommentPayload {
  comment_id: string;
  data: {
    user_id: string;
    content: string;
  };
}
export const getCommentsByLessonId = (
  page: number = 1,
  limit: number = 10,
  lessonId: string,
  sortBy: string,
) =>
  request.get<ResponseApi<IComment[]>>(
    `/comment/by-lesson/${lessonId}?page=${page}&limit=${limit}&order=${sortBy}`,
  );
export const getCommentsByCourseId = (
  page: number = 1,
  limit: number = 10,
  courseId: string,
  sortBy: string,
) =>
  request.get<ResponseApi<IComment[]>>(
    `/comment/by-course/${courseId}?page=${page}&limit=${limit}&order=${sortBy}`,
  );
export const createComment = (payload: CreateCommentPayload) =>
  request.post<ResponseApi<IComment>>(`/comment/upload`, payload);
export const replyComment = (payload: ReplyCommentPayload) =>
  request.post<ResponseApi<IComment>>(
    `/comment/reply-comment/${payload.comment_id}`,
    payload.data,
  );
