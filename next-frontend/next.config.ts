import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Дозволяємо всі шляхи на цьому домені
      },
      // Якщо у тебе є картинки з інших сервісів, додавай їх сюди так само
    ],
  },
};

export default nextConfig;
