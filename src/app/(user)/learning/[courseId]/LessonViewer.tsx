import { ILesson, IVideoLesson } from "@/app/types/lesson";
import React from "react";
import ReactPlayer from "react-player";

export default function LessonViewer({ lesson }: { lesson: ILesson }) {
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
    </div>
  );
}
