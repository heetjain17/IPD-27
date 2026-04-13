import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Custom application errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Drizzle/Postgres errors
  if (typeof err === 'object' && err !== null && 'code' in err) {
    // Unique constraint violation
    if ((err as { code: string }).code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Unique constraint failed',
      });
    }
  }

  // Unknown errors
  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
