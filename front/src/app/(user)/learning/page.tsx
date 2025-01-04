"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LearningPage() {
  const [showTrackList, setShowTrackList] = useState(true);
  const router = useRouter();

  const openpage = () => {
    const id = "6774e751dd251e36c26cd312";
    router.push(`/learning/${id}`); // Update the path to match your route setup
  };

  return (
    <div>
      <div className="flex">
        <button onClick={openpage}>Open Page</button>
        <div className="flex-1">
          {/* <VideoViewer progressBase={progressBase} />
          <LessonInfo /> */}
        </div>
        {showTrackList && (
          <div className="w-[376px]">
            {/* <TrackList
              course={course}
              onClose={() => setShowTrackList(false)}
              moduleSlt={moduleSlt}
              lessonSlt={lessonSlt}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
}
