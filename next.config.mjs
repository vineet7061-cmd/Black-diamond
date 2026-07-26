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
  
  // Yahan meri galti thi, maine ye line uda di thi. Isko wapas add kar diya hai
  // taaki Turbopack wala naya error na aaye.
  turbopack: {}, 
  
  experimental: {
    optimizePackageImports: ['lucide-react', '@base-ui/react'],
  },
  webpack: (config) => {
    // Memory full hone se rokne ke liye
    config.cache = false;
    return config;
  },
};

export default nextConfig;