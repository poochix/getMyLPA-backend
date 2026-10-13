import { authRepository } from './auth.repository.js';

/**
 * Business-logic layer for the Auth module.
 *
 * Service responsibilities:
 * - Implement application/business rules.
 * - Coordinate repositories and other services.
 * - Keep HTTP-specific concerns out of the business layer.
 */

export const authService = {
  async getModuleStatus() {
    const result = await authRepository.getModuleStatus();

    return {
      ...result,
      service: 'Working',
    };
  },
};
