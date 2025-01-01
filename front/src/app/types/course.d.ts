import { ILesson } from "./lesson";
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
