import { ICourse, UpdateCoursePayload } from "../types/course";
import { ResponseApi } from "../types/utils";
import request from "./request";

export const getAllCourse = (
  page: string | number = 1,
  limit: string | number = 10,
) => request.get<ResponseApi<ICourse[]>>(`/course?page=${page}&limit=${limit}`);

export const updateCourse = async (body: UpdateCoursePayload) => {
  return request.post(`course/${body.courseId}`, { data: body.data });
};
export const createCourse = async (data: FormData) => {
  return request.post(`course/`, data);
};
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await request.post<{ file_url: string }>(
      "/media/uploadImage",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  }
};
