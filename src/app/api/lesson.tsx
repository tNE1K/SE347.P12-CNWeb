import { UpdateLessonBody } from "../hooks/useUpdateLesson";
import { ResponseApi } from "../types/utils";
import request from "./request";

export const updateLesson = (data: UpdateLessonBody) =>
  request.put<void>(`/lesson/${data.lessonId}`, data.data);
