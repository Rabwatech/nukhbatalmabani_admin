/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { 
    unoptimized: true,
    domains: ['fonts.gstatic.com', 'fonts.googleapis.com'],
  },
  
  // Font optimization
  optimizeFonts: true,
  
  // Build configuration
  swcMinify: true,
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  
  // Environment variables
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  }
};

module.exports = nextConfig;
