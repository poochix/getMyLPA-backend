import { app } from '@/app.js';
import { env } from '@/config/env.js';
import { logger } from '@/lib/logger.js';
import { prisma } from '@/lib/prisma.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

let server: ReturnType<typeof app.listen> | undefined;
let isShuttingDown = false;

/**
 * Start the application only after PostgreSQL is reachable.
 */
async function startServer(): Promise<void> {
  try {
    await prisma.$connect();

    logger.info('Database connection established');

    if (isShuttingDown) {
      await prisma.$disconnect();
      return;
    }

    server = app.listen(env.PORT, () => {
      logger.info(`GetMyLPA server is running on http://localhost:${env.PORT}`);
    });

    server.on('error', (error: Error) => {
      logger.fatal({ err: error }, 'HTTP server encountered an error');
      process.exitCode = 1;
      void shutdown('SERVER_ERROR');
    });
  } catch (error: unknown) {
    logger.fatal({ err: error }, 'Application startup failed');

    try {
      await prisma.$disconnect();
    } catch (disconnectError: unknown) {
      logger.error(
        { err: disconnectError },
        'Failed to disconnect Prisma after startup failure',
      );
    }

    process.exitCode = 1;
  }
}

/**
 * Stop accepting requests, wait for HTTP connections to close,
 * and disconnect Prisma before the process exits.
 */
async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    logger.warn(`${signal} received while shutdown is already in progress`);
    return;
  }

  isShuttingDown = true;

  logger.info(`${signal} received. Starting graceful shutdown...`);

  const timeout = setTimeout(() => {
    logger.fatal('Graceful shutdown timed out; forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  timeout.unref();

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      logger.info('HTTP server closed successfully');
    }

    await prisma.$disconnect();

    logger.info('Database disconnected successfully');
    logger.info('Graceful shutdown completed');
  } catch (error: unknown) {
    logger.error({ err: error }, 'Error during graceful shutdown');
    process.exitCode = 1;
  } finally {
    clearTimeout(timeout);
  }
}

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

void startServer();
