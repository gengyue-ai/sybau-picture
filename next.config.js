/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sybaupicture.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'v3.fal.media',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fal.media',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      // SEO友好的URL重写
      {
        source: '/meme-generator',
        destination: '/generator'
      },
      {
        source: '/create-sybau-meme',
        destination: '/generator'
      },
      {
        source: '/ai-meme-maker',
        destination: '/generator'
      }
    ]
  },
  async redirects() {
    return [
      // 重定向旧URL到新URL
      {
        source: '/old-generator',
        destination: '/generator',
        permanent: true
      },
      {
        source: '/create',
        destination: '/generator',
        permanent: true
      }
    ]
  },
  async headers() {
    return [
      {
        // 安全头部
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        // 缓存静态资源
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  webpack: (config, { isServer }) => {
    // 优化构建
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
  env: {
    CUSTOM_KEY: 'sybau-picture-v1',
  },
  poweredByHeader: false, // 隐藏X-Powered-By头部
}

module.exports = nextConfig 