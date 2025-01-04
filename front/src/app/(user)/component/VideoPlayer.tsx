"use client";

import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import NavBar from "@/app/component/navBar";
import Script from "next/script";
import { useAuth } from "@/app/component/authProvider";

export default function LiveCourse() {
  const videoRef = useRef(null);
  const { user } = useAuth();
  const playerRef = useRef(null);
  const [isLive, setIsLive] = useState(false); // Trạng thái kiểm tra livestream
  const isTeacher = user?.role === "teacher";
  useEffect(() => {
    // Kiểm tra xem luồng livestream có sẵn hay không
    const checkStream = async () => {
      try {
        const response = await fetch(
          "http://192.168.43.133/live/livestream.m3u8",
          { method: "HEAD" },
        );
        if (response.ok) {
          setIsLive(true); // Luồng livestream có sẵn
        } else {
          setIsLive(false); // Luồng livestream không có
        }
      } catch (error) {
        setIsLive(false); // Xử lý khi không thể kết nối đến server
      }
    };

    checkStream();

    // Dọn dẹp video.js player khi component unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isLive && !playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
      });
    }
  }, [isLive]);

  return (
    <div>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#333", fontSize: "28px" }}>
          ProCode: Web for Coding Courses
        </h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Join us for an interactive livestream session!
        </p>
        <link
          href="https://vjs.zencdn.net/7.11.4/video-js.css"
          rel="stylesheet"
        />
      </header>

      {/* Video Player */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {isLive ? (
          <video
            ref={videoRef}
            className="video-js"
            controls
            preload="auto"
            width="800"
            height="450"
          >
            <source
              src="http://192.168.43.133/live/livestream.m3u8"
              type="application/x-mpegURL"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div>
            {isTeacher && (
              <div className="mt-[200px] flex flex-col items-center gap-2">
                <div>Bước 1: Mở OBS</div>
                <div>Bước 2: Vào Settings -{">"} Stream</div>
                <div>Bước 3: Ở mục Service chọn Custom</div>
                <div>
                  Bước 4: Ở mục Server nhập giá trị: rtmp://10.0.3.87:1935/live/
                </div>
                <div>Bước 5: Ở mục Stream Key nhập giá trị: livestream</div>
              </div>
            )}
          </div>
        )}
      </div>
      <Script
        src="https://vjs.zencdn.net/7.11.4/video.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
