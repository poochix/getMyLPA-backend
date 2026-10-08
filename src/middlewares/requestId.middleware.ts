import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { logger } from '@/lib/logger.js';

/**
 * Generates and attaches a unique identifier to every incoming request.
 *
 * Why this exists:
 * A single HTTP request can pass through multiple layers:
 *
 * Request
 *   ↓
 * Controller
 *   ↓
 * Service
 *   ↓
 * Repository
 *
 * Each layer may generate logs.
 *
 * The request ID allows us to correlate those logs and determine
 * that they all belong to the same HTTP request.
 *
 * The generated ID is also returned to the client through the
 * X-Request-ID response header. This allows a user or support
 * engineer to provide the ID when investigating an API problem.
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  /*
   * Generate a new UUID for this request.
   *
   * Node's built-in crypto module provides randomUUID(),
   * so no additional npm package is required.
   */
  const requestId = randomUUID();

  req.id = requestId;
  req.log = logger.child({ requestId });

  /*
   * Store the request ID in Express' request-local response storage.
   *
   * res.locals belongs to the current request only, so the value
   * cannot accidentally be shared between different requests.
   */
  res.locals.requestId = requestId;

  /*
   * Send the same ID back to the client.
   *
   * This is especially useful when debugging production API errors.
   */
  res.setHeader('X-Request-ID', requestId);

  next();
}
