import { app } from '@/app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

/**
 * Start the HTTP server.
 *
 * Keeping server startup separate from Express application
 * configuration makes the app easier to test and reuse.
 */
const server = app.listen(env.PORT, () => {
  logger.info(`GetMyLPA server is running on http://localhost:${env.PORT}`);
});

/*
 * Gracefully shut down the server when the process receives
 * a termination signal.
 *
 * This becomes important when deploying to containers or
 * cloud platforms where processes may be restarted.
 */

const shutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down...`);

  // 1. Start the fallback timeout immediately.
  // If the cleanup hangs anywhere below, this will trigger.
  const forceQuitTimeout = setTimeout(() => {
    logger.warn(
      'Could not close connections in time, forcefully shutting down.',
    );
    process.exit(1);
  }, 10000); // 10 seconds

  // 2. Stop accepting new connections
  server.close(async (err) => {
    if (err) {
      logger.error(err, 'Error during HTTP server closure');
      clearTimeout(forceQuitTimeout);
      process.exit(1);
    }
    logger.info('HTTP server is closed');

    try {
      // 3. Optional: Closes database connections or other resources here safely
      // await prisma.\$disconnect();
      // logger.info('Database disconnected cleanly');

      // Clear the timeout since we finished successfully, then exit
      clearTimeout(forceQuitTimeout);
      process.exit(0);
    } catch (dbError) {
      logger.error(dbError, 'Error disconnecting database during shutdown');
      clearTimeout(forceQuitTimeout);
      process.exit(1);
    }
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
