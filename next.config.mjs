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
  images: {
    unoptimized: true,
  },
  // Purana error hatane ke liye
  turbopack: {},
  
  // NAYA: Memory leak aur Crash (Code 134) theek karne ke liye
  experimental: {
    webpackMemoryOptimizations: true,
  },
  webpack: (config, { dev }) => {
    // Prod build ke waqt memory limit na cross ho isliye cache ko disable kiya
    if (!dev) {
      config.cache = false; 
    }
    return config;
  },
};

export default withPWA(nextConfig);