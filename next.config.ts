import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // 1. Enable static export
  output: 'export',
  
  // 2. Disable image optimization (required for static exports)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;