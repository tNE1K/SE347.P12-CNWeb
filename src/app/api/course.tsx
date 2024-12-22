import { ICourse } from "../types/course";
import { ResponseApi } from "../types/utils";
import request from "./request";

export const getAllCourse = (
  page: string | number = 1,
  limit: string | number = 10,
) => request.get<ResponseApi<ICourse[]>>(`/course?page=${page}&limit=${limit}`);
