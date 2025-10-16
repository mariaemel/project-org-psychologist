/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
        pathname: '/media/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.onrender.com',
        pathname: '/media/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.herokuapp.com',
        pathname: '/media/images/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
