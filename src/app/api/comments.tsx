import { IComment } from "../types/comment";
import { ResponseApi } from "../types/utils";
import request from "./request";

export const getCommentsByLessonId = (
  page: number = 1,
  limit: number = 10,
  lessonId: string,
) =>
  request.get<ResponseApi<IComment[]>>(
    `/comment/by-lesson/${lessonId}?page=${page}&limit=${limit}`,
  );
