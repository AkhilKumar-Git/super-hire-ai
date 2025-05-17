import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // This makes the OPENAI_API_KEY available to the server-side code
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Ensure environment variables are available at build time
  serverRuntimeConfig: {
    openAIApiKey: process.env.OPENAI_API_KEY,
  },
  // Environment variables available on both server and client
  publicRuntimeConfig: {
    // Add any public config here
  },
};

export default nextConfig;
