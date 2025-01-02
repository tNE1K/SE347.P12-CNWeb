import {
  CourseCount,
  ICourse,
  IUserLesson,
  UpdateCoursePayload,
  UserEnrollCourseCount,
} from "../types/course";
import { ResponseApi } from "../types/utils";
import request from "./request";

export const getAllCourse = (
  page: string | number = 1,
  limit: string | number = 10, //check var!
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
export const getCourseByLabel = (label: string) =>
  request.get<ResponseApi<ICourse[]>>(`/course?label=${label}`);
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
export const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file); // Append the file to the FormData object

  try {
    // POST request to upload the video file
    const response = await request.post<{ file_url: string }>(
      "/media/uploadVideo", // Endpoint for video upload
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type for file upload
        },
      },
    );

    return response; // Return the response with the uploaded video URL
  } catch (error) {
    console.error("Error uploading video:", error); // Log any errors
    throw new Error("Video upload failed");
  }
};
export const getUserEnrollCount = async (teacherId?: string) =>
  request.get<Promise<UserEnrollCourseCount>>(
    `/course/get-user-count-stats/${teacherId}`,
  );
export const getCourseCount = async (teacherId?: string) =>
  request.get<Promise<CourseCount>>(
    `/course/get-course-count-stats/${teacherId}`,
  );
export const getCourseProgress = async (courseId: string, userId: string) =>
  request.get<ResponseApi<IUserLesson[]>>(
    `/progress/get-course-progress?course_id=${courseId}&user_id=${userId}`,
  );
export const createUserLesson = async (
  courseId: string,
  lessonId: string,
  userId: string,
) =>
  request.post<ResponseApi<IUserLesson>>(`/progress/create`, {
    user_id: userId,
    course_id: courseId,
    lesson_id: lessonId,
  });
