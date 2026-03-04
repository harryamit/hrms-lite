/**
 * Central config from environment. Ensure dotenv is loaded before this is used (e.g. import 'dotenv/config' in index.ts first).
 */
export const config = {
  port: Number(process.env.PORT) || 3001,
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/hrms-lite',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  requireAuth: process.env.REQUIRE_AUTH === 'true',
  retryDbMs: 10000,
} as const;
