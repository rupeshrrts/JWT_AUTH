import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { ENV, getAllowedOrigins } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { prisma } from './lib/prisma.js';

const app: Express = express();

// 1. Production Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Dynamic CORS Configuration (Handles single or multiple frontend origins)
const allowedOrigins = getAllowedOrigins();
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        ENV.NODE_ENV === 'development'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Request Parsing
app.use(express.json());
app.use(cookieParser());

// 4. Rate Limiting for Auth Endpoints (Prevents brute-force & credential stuffing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: ENV.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// 5. Production Health & DB Probe Endpoint (GET /api/health)
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Quick DB ping to confirm PostgreSQL connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: ENV.NODE_ENV,
      database: 'connected',
    });
  } catch (err: any) {
    res.status(503).json({
      success: false,
      status: 'degraded',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: err.message,
    });
  }
});

// 6. Authentication Routes (with rate-limiting applied)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);

// 7. Centralized Global Error Handler
app.use(errorHandler);

export default app;
