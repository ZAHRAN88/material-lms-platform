/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'utfs.io'},
      { hostname: 'img.clerk.com'}
    ]
  },
  experimental: {
    serverActions: true,
  },
  
};

export default nextConfig;
