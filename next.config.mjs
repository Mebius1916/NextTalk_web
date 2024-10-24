/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: false, // 临时重定向，你可以根据需要设置为 true
      },
    ]
  }
};

export default nextConfig;
