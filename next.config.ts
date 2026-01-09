import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 允许开发环境跨域请求
  allowedDevOrigins: ['*'],

  // 优化环境变量加载
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
};

export default nextConfig;
