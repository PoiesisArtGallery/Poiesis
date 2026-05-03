
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
 
  images: {
    unoptimized: true,
    domains: [
      "encrypted-tbn0.gstatic.com",
      "images.unsplash.com",
      "eodjhqlydbdqopganynm.supabase.co", // 🔥 replace with your Supabase URL
    ],
  },

  allowedDevOrigins: ["192.168.1.4", "localhost"]
}

export default nextConfig
