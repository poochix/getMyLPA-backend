import { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '@/utils/ApiError.js';
import { env } from '@/config/env.js';
import { logger } from '@/lib/logger.js';

interface ErrorResponseBody {
  success: false;
  message: string;
  // code?: string;
  errors?: unknown;
  stack?: string;
}

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction, // Prefix with underscore to satisfy strict TypeScript
): void {
  let statusCode = 500;
  let message = 'Internal Server Error';
  // let code = 'INTERNAL_SERVER_ERROR';
  let errors: unknown = undefined;

  // 1. Handle our custom operational ApiError
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    // code = (error as ApiError).isOperational
    //   ? 'OPERATIONAL_ERROR'
    //   : 'INTERNAL_ERROR';
  }
  // 2. Automatically intercept and format Zod validation errors
  else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    // code = 'VALIDATION_ERROR';
    errors = error.flatten().fieldErrors; // Extracts clean field-specific errors
  }
  // 3. Unknown/Programmer errors: MUST log before responding
  else {
    logger.error(error, '🔥 Unhandled Application Exception');
  }

  // 4. Construct the final response payload
  const responsePayload: ErrorResponseBody = {
    success: false,
    message,
    // code,
    ...(errors !== undefined && { errors }),
    // Only append the stack trace if we are in development mode
    ...(env.NODE_ENV === 'development' &&
      error instanceof Error && { stack: error.stack }),
  };

  res.status(statusCode).json(responsePayload);
}
