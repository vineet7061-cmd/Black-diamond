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
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['lucide-react', '@base-ui/react'],
  },
  webpack: (config) => {
    // ASLI FIX YAHAN HAI: Webpack ki caching puri tarah band
    // Ab ye RAM me kachra jama nahi karega
    config.cache = false;
    return config;
  },
};

export default nextConfig;