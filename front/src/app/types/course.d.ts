import { ILesson } from "./lesson";
import { IUser } from "./user";
export interface ICourse {
  _id: string;
  comments: string[];
  cover: string;
  description: string;
  label: string[];
  lessonIds: ILesson[];
  participantsId: string[];
  rating: number;
  status: "publish" | "hide";
  title: string;
  createdAt: string;
  rating: number;
  price: number;
  numberRatings: number;
  teacher_id: string;
  teacher: IUser;
}
export interface UpdateCoursePayload {
  courseId: string;
  data: {
    title?: string;
    description?: string;
    status?: string;
    label?: string[];
    cover?: string;
    lessonIds?: string[];
    price?: number;
  };
}
export interface SearchCourseParams {
  page: number;
  limit: number;
  order: string;
  keyword: string;
  rating: number;
  label: string;
  priceFrom: number;
  priceTo: number;
}
export interface UserEnrollCourseCount {
  data: {
    name: string;
    numberEnroll: number;
  }[];
  message: string;
  status: string;
  totalUniqueUsersEnroll: number;
}
export interface CourseCount {
  data: {
    label: string;
    numberCourse: number;
  }[];
  message: string;
  status: string;
  totalCourses: number;
}
