import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/app',
  output: 'export',
  trailingSlash: true, // Recommended for static exports on many hosts
  // assetPrefix: '/app', // Uncomment if assets fail to load from subpath
};

export default nextConfig;
