import React from "react";
import Head from "next/head";
import Script from "next/script";
import VideoPlayer from "./VideoPlayer";

export default function Livestream() {
  return (
    <div>
      <Head>
        <title>Video on Demand</title>
        <meta charSet="UTF-8" />
        <link
          href="https://vjs.zencdn.net/7.11.4/video-js.css"
          rel="stylesheet"
        />
      </Head>
      <VideoPlayer />
      <Script
        src="https://vjs.zencdn.net/7.11.4/video.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

