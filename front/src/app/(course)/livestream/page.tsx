import React from "react";
import Head from "next/head";

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

      <h1>Welcome to Our Video on Demand Service</h1>
      <p>
        Enjoy unlimited access to a wide range of high-quality videos on demand.
        From movies to educational content, we've got you covered.
      </p>

      <video
        id="my-video"
        className="video-js vjs-default-skin"
        controls
        preload="auto"
        width="800"
        height="450"
        data-setup="{}"
      >
        <source src="livestream.m3u8" type="application/x-mpegURL" />
        Your browser does not support the video tag.
      </video>

      <script src="https://vjs.zencdn.net/7.11.4/video.js"></script>
    </div>
  );
}
