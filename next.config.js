/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'], // Add any other image domains you're using
  },
  output: 'standalone',
  // Remove experimental features that might cause issues
  experimental: {
    optimizeCss: false,
  },
  webpack: (config) => {
    config.stats = {
      errorDetails: true,
    }
    return config
  },
}

module.exports = nextConfig
