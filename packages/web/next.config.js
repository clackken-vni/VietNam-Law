/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@vietlex/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
}

module.exports = nextConfig
