import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Muve-",
  assetPrefix: "/Muve-",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
