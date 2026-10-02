import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { ENV } from '../config/env.js';
import { CookieOptions } from 'express';

/**
 * Production-ready Cookie Configuration
 * - httpOnly: Blocks client-side JavaScript access (prevents XSS token theft)
 * - secure: Enforces HTTPS in production
 * - sameSite: 'lax' for typical web apps, or 'none' if backend and frontend are on completely separate domains with HTTPS
 * - maxAge: 1 hour (3,600,000 ms)
 */
export const getCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: ENV.NODE_ENV === 'production' ? 'lax' : 'lax',
  maxAge: 60 * 60 * 1000, // 1 hour
  path: '/',
});

export const authController = {
  // POST /api/auth/register
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.register(validatedData);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/login
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { token, user } = await authService.login(validatedData);

      const cookieOptions = getCookieOptions();

      // Set cookie in browser cookie jar
      res.cookie(ENV.COOKIE_NAME, token, cookieOptions);
      if (ENV.COOKIE_NAME !== 'token') {
        res.cookie('token', token, cookieOptions); // Alias for compatibility
      }

      // Return user info and token (allows mobile apps / non-browser clients to store token in memory/secure store)
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/me (Protected endpoint)
  async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await authService.getUserById(userId);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/logout
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clearOptions = {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      };

      res.clearCookie(ENV.COOKIE_NAME, clearOptions);
      res.clearCookie('token', clearOptions);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
