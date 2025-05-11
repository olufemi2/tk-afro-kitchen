/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true, // This helps with Netlify deployment
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  output: 'export', // Change from 'standalone' to 'export' for static deployment
  // Remove experimental features that might cause issues
  experimental: {
    optimizeCss: false,
  },
  webpack: (config) => {
    // Add next-auth to externals to prevent build issues
    config.externals = [...(config.externals || []), 'next-auth'];
    
    config.stats = {
      errorDetails: true,
    }
    return config
  },
}

module.exports = nextConfig
