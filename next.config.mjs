import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Typescript errors ko ignore karega
  typescript: {
    ignoreBuildErrors: true, 
  },
  // 2. ESLint sabse zyada RAM khata hai, isko build me disable kiya
  eslint: {
    ignoreDuringBuilds: true, 
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  // 3. Vercel pe memory crash na ho isliye ye add kiya
  experimental: {
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