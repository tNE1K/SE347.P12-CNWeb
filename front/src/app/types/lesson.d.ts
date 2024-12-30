export interface ILesson {
  _id: string;
  comments: string[];
  description: string;
  duration: number;
  resource: IVideoLesson[] | IScriptLesson[] | ISelectionLesson[];
  title: string;
  createdAt: string;
  type: "video" | "scriptlesson" | "testselection";
  rating: number;
  numberRatings: number;
}
export interface IVideoLesson {
  _id: string;
  duration: number;
  file: string;
}
export interface IScriptLesson {
  _id: string;
  content: string;
  expected: string;
}
export interface ISelectionLesson {
  _id: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
  explanation: string;
  question: string;
}
