import { type Request, type Response } from 'express';
import { authService } from './auth.service.js';
import { ApiResponse } from '@/utils/apiResponse.js';
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

  // Wrap the successful result in our standardized API response.
  const response = new ApiResponse(200, result, 'auth module working');
  // Send the standardized response to the client.
  return res.status(response.statusCode).json(response);
};
