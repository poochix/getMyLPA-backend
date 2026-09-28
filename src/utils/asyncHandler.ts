import { type Request, type Response, type NextFunction } from 'express';

/**
 * Wraps an async Express route/controller and forwards
 * rejected promises to Express's centralized error handler.
 *
 * Without this wrapper, every async controller would need
 * its own try/catch block:
 *
 * try {
 *   // controller logic
 * } catch (error) {
 *   next(error);
 * }
 *
 * asyncHandler() removes that repetition and keeps controllers
 * focused on application logic.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>, //unknown over any
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    /**
     * Promise.resolve() ensures that both synchronous throws
     * and rejected promises are forwarded to Express's
     * error-handling middleware.
     */
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
