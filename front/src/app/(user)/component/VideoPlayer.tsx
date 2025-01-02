"use client";

import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import NavBar from "@/app/component/navBar";
import Script from "next/script";

export default function LiveCourse() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isLive, setIsLive] = useState(false); // Trạng thái kiểm tra livestream

  useEffect(() => {
    // Kiểm tra xem luồng livestream có sẵn hay không
    const checkStream = async () => {
      try {
        const response = await fetch("http://10.0.3.87/live/livestream.m3u8", { method: "HEAD" });
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
        <h1 style={{ color: "#333", fontSize: "28px" }}>ProCode: Web for Coding Courses</h1>
        <p style={{ color: "#666", fontSize: "16px" }}>Join us for an interactive livestream session!</p>
        <link
          href="https://vjs.zencdn.net/7.11.4/video-js.css"
          rel="stylesheet"
        />
      </header>

      {/* Video Player */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        {isLive ? (
          <video
            ref={videoRef}
            className="video-js"
            controls
            preload="auto"
            width="800"
            height="450"
          >
            <source src="http://10.0.3.87/live/livestream.m3u8" type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div style={{ color: "#888", fontSize: "100px", textAlign: "center" }}>
            <h1>There is no livestream now. Please comback later!</h1>
          </div>
        )}
      </div>
      <Script
        src="https://vjs.zencdn.net/7.11.4/video.js"
        strategy="afterInteractive"
      />

      {/* Course Details */}
      <section style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
        <h2 style={{ color: "#444", fontSize: "24px" }}>Course Overview</h2>
        <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.6" }}>
          This course covers advanced topics in web development, including real-time data processing, 
          scalable architectures, and best practices in modern front-end and back-end frameworks. 
          Interact with experts and peers in our live Q&A sessions.
        </p>
      </section>
    </div>
  );
}
