import { ApiError } from '@/utils/ApiError.js';
import type { NextFunction, Request, Response } from 'express';

/**
 * Handles requests that do not match any registered route.
 *
 * This middleware should be registered after all application routes.
 * Instead of sending the 404 response directly, it creates an
 * ApiError and forwards it to the centralized error middleware.
 *
 * This keeps all error-response formatting in one place.
 */
export function notFoundMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const errorMessage = `Cannot find ${req.method} ${req.originalUrl} on this server`;

  const error = ApiError.notFound(errorMessage);

  next(error);
}
