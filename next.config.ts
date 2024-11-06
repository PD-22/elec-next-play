import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // TODO: Step 8 — Building the executables
  // output: "export",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
