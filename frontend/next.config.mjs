/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  env: {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dynamic-assets.coinbase.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
