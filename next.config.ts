import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Roblox asset thumbnails (tr.rbxcdn.com, t0–t7.rbxcdn.com, …)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.rbxcdn.com",
      },
    ],
  },
};

export default nextConfig;
