import { Router } from 'express';
import { getAuthModuleStatus } from './auth.controller.js';

const router = Router();

/**
 * GET /api/v1/auth/status
 *
 * Architectural test endpoint used to verify that
 * requests correctly flow through the Auth module.
 */
router.get('/status', getAuthModuleStatus);

export { router as authRouter };
