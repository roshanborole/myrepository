import type { NextConfig } from "next";

// Extract hostname if a full URL is passed in LOAD_BALANCER_DNS or ALLOWED_ORIGIN
function formatOrigin(origin?: string): string | null {
  if (!origin) return null;
  return origin.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim();
}

const customAlbOrigin = formatOrigin(process.env.LOAD_BALANCER_DNS);
const extraOrigin = formatOrigin(process.env.ALLOWED_ORIGIN);

const allowedOrigins: string[] = [
  '*.elb.amazonaws.com',
  '*.amazonaws.com',
  'localhost:3000',
  '127.0.0.1:3000',
  '13.232.84.8',
];

if (customAlbOrigin && !allowedOrigins.includes(customAlbOrigin)) {
  allowedOrigins.push(customAlbOrigin);
}

if (extraOrigin && !allowedOrigins.includes(extraOrigin)) {
  allowedOrigins.push(extraOrigin);
}

const nextConfig: NextConfig = {
  // Configure Server Actions CSRF allowed origins for AWS Load Balancer deployments
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;
