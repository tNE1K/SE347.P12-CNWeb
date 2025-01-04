import type { NextConfig } from "next";
import dotenv from "dotenv"
dotenv.config()

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    MY_API_URL: process.env.MY_API_URL,
  },
};

export default nextConfig;
