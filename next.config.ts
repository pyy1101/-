import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  serverExternalPackages: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
};

export default nextConfig;
