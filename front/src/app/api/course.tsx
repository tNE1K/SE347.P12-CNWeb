import { ICourse, UpdateCoursePayload } from "../types/course";
import { ResponseApi } from "../types/utils";
import request from "./request";

export const getAllCourse = (
  page: string | number = 1,
  limit: string | number = 10,
  sortBy: string | "",
  keyword: string = "",
  rating: number = 0,
  label: string = "",
  priceFrom: number = 0,
  priceTo: number = 10000000,
  teacherId: string = "",
) =>
  request.get<ResponseApi<ICourse[]>>(
    `/course?page=${page}&limit=${limit}&order=${sortBy}&keyword=${keyword}&rating=${rating}&label=${label}&priceFrom=${priceFrom}&priceTo=${priceTo}&teacher_id=${teacherId}`,
  );
export const getCourseById = (courseId: string) =>
  request.get<ResponseApi<ICourse>>(`/course/${courseId}`);
export const updateCourse = async (body: UpdateCoursePayload) => {
  return request.put(`course/${body.courseId}`, body.data);
};
export const createCourse = async (data: FormData) => {
  return request.post(`course/`, data);
};
export const deleteCourse = async (courseId: string) => {
  return request.delete(`course/${courseId}`);
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
