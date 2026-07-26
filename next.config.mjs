import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // YAHAN HAI MAIN FIX: 
  // Ye Next.js ko ek hi thread me build karne ko majboor karega jisse RAM bachegi
  experimental: {
    cpus: 1, 
    workerThreads: false,
    memoryBasedWorkersCount: false,
    webpackMemoryOptimizations: true,
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

export default withPWA(nextConfig);