import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "encrypted-tbn0.gstatic.com", // ✅ Google images
      "images.unsplash.com",        // (optional future)
      "your-supabase-url.supabase.co" // 🔥 IMPORTANT (replace with yours)
    ],
  },
}

module.exports = nextConfig