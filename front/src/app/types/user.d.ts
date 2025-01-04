export interface User {
  id: string;
  email: string;
  role: string;
  isVerify: boolean;
  firstName: string;
  lastName: string;
  birthday: string;
  teacherVerifyRequest: boolean;
}

export interface IUser {
  _id: string;
  avatar: string;
  birthday: string;
  email: string;
  firstName: string;
  isVerify: boolean;
  lastName: string;
  participatedCourses: string[];
  role: "teacher" | "user" | "admin";
  teacherVerifyRequest: boolean;
  verifyImage: string[];
}
