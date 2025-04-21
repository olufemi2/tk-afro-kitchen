/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'], // Add any other image domains you're using
  },
  // Remove experimental features that might cause issues
  experimental: {
    optimizeCss: false,
  },
}

module.exports = nextConfig
