"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function LiveCourse() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', fontSize: '28px' }}>Live Course: Advanced Web Development</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Join us for an interactive livestream session!</p>
      </header>

      {/* Video Player */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
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
      </div>

      {/* Course Details */}
      <section style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#444', fontSize: '24px' }}>Course Overview</h2>
        <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.6' }}>
          This course covers advanced topics in web development, including real-time data processing, 
          scalable architectures, and best practices in modern front-end and back-end frameworks. 
          Interact with experts and peers in our live Q&A sessions.
        </p>
      </section>

      {/* Footer */}
      <footer>
      </footer>
    </div>
  );
}

