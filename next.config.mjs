/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DEPLOYMENT_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://gtm-play-router.ayomideahmedcp.workers.dev',
  },
};
export default nextConfig;
