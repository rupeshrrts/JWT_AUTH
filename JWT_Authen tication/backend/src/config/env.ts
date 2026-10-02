import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/jwt_auth',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  // Can be a single origin or comma-separated list of allowed origins
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  COOKIE_NAME: process.env.COOKIE_NAME || 'accessToken',
  // Rate limiting defaults (per 15 min window)
  AUTH_RATE_LIMIT_MAX: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
};

// Helper to get allowed origins as an array
export const getAllowedOrigins = (): string[] => {
  return ENV.FRONTEND_URL.split(',').map((url) => url.trim());
};
