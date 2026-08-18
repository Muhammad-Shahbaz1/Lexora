import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable the development 'N' badge/indicator
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Allow CORS for API calls during development
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:5000' },
        ],
      },
    ];
  },
};

export default nextConfig;
