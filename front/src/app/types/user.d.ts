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
  email: string;
  fullName: string;
  isVerify: boolean;
  participatedCourses: string[];
  password: string;
  role: "teacher" | "user" | "admin";
}
