export interface IComment {
  _id: string;
  content: string;
  course_id: string;
  createdAt: string;
  isReply: boolean;
  lesson_id: string;
  numberDisLike: number;
  numberLike: number;
  rating: number;
  replyIds: IComment[];
  user_id: string;
  user_info: {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}
