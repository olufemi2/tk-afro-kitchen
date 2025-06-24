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
  
  // Set proper headers for Safari payment redirects and cross-site compatibility
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        // Specific headers for payment and success pages
        source: '/(checkout|success|api/create-payment-intent)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      {
        // Safari-specific payment iframe headers
        source: '/api/create-payment-intent/:path*',
        headers: [
          {
            key: 'Set-Cookie',
            value: 'SameSite=None; Secure; HttpOnly',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://tk-afro-kitchen-nkh8kymez-olufemi2s-projects.vercel.app'
              : 'http://localhost:3000',
          },
        ],
      },
    ];
  },
  
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
