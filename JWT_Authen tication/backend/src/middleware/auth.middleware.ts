import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

/**
 * Universal JWT Authentication Middleware
 * 
 * Supports both:
 * 1. HttpOnly Cookies: `req.cookies.accessToken` or `req.cookies.token` (Web browsers)
 * 2. Authorization Header: `Bearer <token>` (Mobile apps, Postman, microservices, SPA)
 */
export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  let token: string | undefined;

  // 1. Check HttpOnly cookies first
  if (req.cookies && (req.cookies.accessToken || req.cookies.token)) {
    token = req.cookies.accessToken || req.cookies.token;
  }

  // 2. Fallback to Authorization Header (`Bearer <token>`)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // 3. Reject if no token found
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Authentication token required',
    });
    return;
  }

  try {
    // 4. Verify signature & expiration against JWT_SECRET
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { userId: string };

    // 5. Attach decoded userId to request object for downstream controllers
    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token',
    });
  }
};
