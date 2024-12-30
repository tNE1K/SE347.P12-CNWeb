"use client";
import React, { useState } from "react";

export default function LearingPage() {
  const [showTrackList, setShowTrackList] = useState(true);

  return (
    <div>
      <div className="flex">
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
