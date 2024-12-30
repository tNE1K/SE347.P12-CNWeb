import { ILesson, ISelectionLesson, IVideoLesson } from "@/app/types/lesson";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { answerTestSelection } from "@/app/api/lesson";

export default function LessonViewer({ lesson }: { lesson: ILesson }) {
  const quizzes: ISelectionLesson[] =
    lesson?.type === "testselection"
      ? (lesson?.resource as ISelectionLesson[])
      : [];
  const [curQuiz, setCurQuiz] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showExplan, setShowExplan] = useState(false);
  // State to store the selected answers for each quiz
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  // Handle answer selection
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [curQuiz]: value,
    }));
  };

  const submitAnswers = async () => {
    try {
      const results = await Promise.all(
        quizzes.map(async (quiz, index) => {
          const answer = answers[index];
          if (answer) {
            const response = await answerTestSelection(quiz._id, answer);
            return response.is_correct;
          }
          return false;
        }),
      );

      const allCorrect = results.every((isCorrect) => isCorrect === true);

      setCorrect(allCorrect);
      setShowResult(true);
      setShowExplan(true);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  return (
    <div>
      {lesson.type === "video" && (
        <div className="w-full">
          <ReactPlayer
            width={`100%`}
            height={500}
            muted={true}
            playing={true}
            style={{ backgroundColor: "#000" }}
            controls={true}
            url={
              (lesson.resource[0] as IVideoLesson).file ||
              "https://files.vidstack.io/sprite-fight/720p.mp4"
            }
          />
        </div>
      )}
      {quizzes.length > 0 && (
        <div className="mt-4 w-full">
          <div key={quizzes[curQuiz]._id} className="mb-4 border-gray-300 p-8">
            {!showResult && (
              <>
                <h3 className="text-lg font-bold">Question {curQuiz + 1}:</h3>
                <p className="mb-2">{quizzes[curQuiz].question}</p>
                <FormControl>
                  <FormLabel>Choose your answer:</FormLabel>
                  <RadioGroup
                    aria-labelledby={`quiz-${curQuiz}-label`}
                    name={`quiz-${curQuiz}`}
                    value={answers[curQuiz] || ""}
                    onChange={handleAnswerChange}
                  >
                    <FormControlLabel
                      value="A"
                      control={<Radio />}
                      label={`A: ${quizzes[curQuiz].answerA}`}
                    />
                    <FormControlLabel
                      value="B"
                      control={<Radio />}
                      label={`B: ${quizzes[curQuiz].answerB}`}
                    />
                    <FormControlLabel
                      value="C"
                      control={<Radio />}
                      label={`C: ${quizzes[curQuiz].answerC}`}
                    />
                    <FormControlLabel
                      value="D"
                      control={<Radio />}
                      label={`D: ${quizzes[curQuiz].answerD}`}
                    />
                  </RadioGroup>
                </FormControl>{" "}
                {showExplan && (
                  <>
                    <div className="mt-2">
                      <strong>Correct Answer:</strong>{" "}
                      {quizzes[curQuiz].correctAnswer}
                    </div>
                    <div className="mt-2">
                      <strong>Explanation:</strong>{" "}
                      {quizzes[curQuiz].explanation}
                    </div>
                  </>
                )}
              </>
            )}
            {showResult && (
              <div className="result-container mt-4 rounded-lg border p-6">
                {correct ? (
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-green-500">
                      Congratulations!
                    </h2>
                    <p className="mt-2 text-lg">
                      You answered all questions correctly!
                    </p>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setShowResult(false);
                        console.log("User completed the quiz");
                      }}
                      className="mt-4"
                    >
                      Finish Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-red-500">Oops!</h2>
                    <p className="mt-2 text-lg">
                      Some answers are incorrect. Try again!
                    </p>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setShowResult(false);
                        setShowExplan(false);
                      }}
                      className="mt-4"
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <Button
                variant="outlined"
                autoFocus
                startIcon={<ChevronLeftIcon />}
                onClick={() => {
                  if (curQuiz >= 1) {
                    setCurQuiz((prev) => prev - 1);
                    if (showResult) setShowResult(false);
                  }
                }}
                className="my-4 w-[150px]"
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                autoFocus
                endIcon={<ChevronRightIcon />}
                onClick={() => {
                  if (quizzes.length - 1 > curQuiz) {
                    setCurQuiz((prev) => prev + 1);
                  }
                }}
                className="my-4 w-[150px]"
              >
                Next
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                variant="contained"
                autoFocus
                onClick={submitAnswers} // Submit all answers when clicked
                className="my-4 w-[150px]"
              >
                Complete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
