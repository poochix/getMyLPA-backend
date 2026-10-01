/**
 * Data-access layer for the Auth module.
 *
 * Repository responsibilities:
 * - Communicate with the database or external data source.
 * - Keep database-specific logic out of services.
 *
 * Database integration will be added when Prisma/PostgreSQL
 * is implemented.
 */

export const authRepository = {
  async getModuleStatus() {
    return {
      module: 'auth',
      repository: 'Working',
    };
  },
};
