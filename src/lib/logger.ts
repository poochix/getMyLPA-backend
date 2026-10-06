import pino from 'pino';

import { env } from '@/config/env.js';

/**
 * Application-wide logger.
 *
 * Pino provides structured logging for the backend.
 *
 * The logger has different levels of importance:
 *
 * - debug → detailed information useful during development
 * - info  → normal application events
 * - warn  → unusual situations that do not stop the application
 * - error → something failed
 * - fatal → a critical failure that may prevent the application
 *             from continuing safely
 *
 * We use a more verbose logging level during development and
 * reduce unnecessary logs in production.
 */

const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
});

/**
 * Export one shared logger instance.
 *
 * Other parts of the application should import this instance
 * instead of creating their own Pino logger.
 *
 * Example:
 *
 * logger.info("Server started");
 * logger.warn("Slow API request");
 * logger.error(error, "Database operation failed");
 */
export { logger };
