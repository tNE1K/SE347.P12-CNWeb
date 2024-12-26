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
  };
}
