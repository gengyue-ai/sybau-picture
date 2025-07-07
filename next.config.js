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

    ],
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      // SEO友好的URL重写 - 重定向到首页（generator功能已集成到首页）
      {
        source: '/meme-generator',
        destination: '/'
      },
      {
        source: '/create-sybau-meme',
        destination: '/'
      },
      {
        source: '/ai-meme-maker',
        destination: '/'
      }
    ]
  },
  async redirects() {
    return [
      // 重定向旧URL到首页
      {
        source: '/old-generator',
        destination: '/',
        permanent: true
      },
      {
        source: '/create',
        destination: '/',
        permanent: true
      },
      {
        source: '/generator',
        destination: '/',
        permanent: true
      },
      {
        source: '/zh/generator',
        destination: '/zh',
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
  webpack: (config, { isServer, dev }) => {
    // 优化构建
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    // 在开发环境中禁用CSS source map以避免控制台警告
    if (dev) {
      config.devtool = 'eval-source-map'
    }

    return config
  },
  env: {
    CUSTOM_KEY: 'sybau-picture-v1',
  },
  poweredByHeader: false, // 隐藏X-Powered-By头部
}

module.exports = nextConfig
