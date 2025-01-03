import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    MY_API_URL: 'http://localhost:5000',
  },
};

export default nextConfig;
