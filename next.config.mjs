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
  i18n: {
    locales: ['en', 'fr'], // Add your supported locales here
    defaultLocale: 'en',   // Set the default locale
  },
};

export default nextConfig;
