import { type Request, type Response } from 'express';
import { authService } from './auth.service.js';
/**
 * HTTP/controller layer for the Auth module.
 *
 * Controller responsibilities:
 * - Receive HTTP requests.
 * - Call the appropriate service.
 * - Convert service results into HTTP responses.
 *
 * Business logic should not be implemented here.
 */

export const getAuthModuleStatus = async (_req: Request, res: Response) => {
  const result = await authService.getModuleStatus();

  res.status(200).json({
    success: true,
    data: result,
  });
};
