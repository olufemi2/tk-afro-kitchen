/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: process.env.NODE_ENV === 'staging' || !process.env.VERCEL, // Disable optimization for staging and static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Use standalone for Vercel, export for static sites
  output: process.env.VERCEL ? undefined : 'export',
  
  // Optimize for Vercel builds
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-slot'],
  },
  
  // Faster builds
  swcMinify: true,
  
  webpack: (config, { dev, isServer }) => {
    // Add next-auth to externals to prevent build issues
    config.externals = [...(config.externals || []), 'next-auth'];
    
    // Optimize for faster builds
    if (!dev && !isServer) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    
    config.stats = {
      errorDetails: true,
    }
    return config
  },
}

module.exports = nextConfig
