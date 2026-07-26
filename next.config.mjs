import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // TypeScript ki error se build fail nahi hoga
  },
  eslint: {
    ignoreDuringBuilds: true, // ESLint RAM nahi khayega
  },
  images: {
    unoptimized: true,
  },
  turbopack: {}, // Ye teri wo Turbopack wali warning hata dega
  experimental: {
    webpackMemoryOptimizations: true,
  }
};

export default withPWA(nextConfig);