import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ENV } from '../config/env.js';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: err.errors[0]?.message || 'Validation error',
      errors: err.errors,
    });
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Handle unhandled errors
  console.error('Unhandled Error:', err);
  const statusCode = 500;
  const message = ENV.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
