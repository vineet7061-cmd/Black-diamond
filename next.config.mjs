import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", 
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Build ke waqt TS error RAM na khaye
  },
  eslint: {
    ignoreDuringBuilds: true, // Build ke waqt ESLint RAM na khaye
  },
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false, // SABSE ZAROORI: Ye aadhi RAM bacha lega
  experimental: {
    webpackBuildWorker: true, // Ye Vercel pe RAM ko manage karta hai
  },
};

export default withPWA(nextConfig);