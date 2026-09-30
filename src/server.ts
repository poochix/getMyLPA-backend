import { app } from '@/app.js';
import { env } from './config/env.js';

/**
 * Start the HTTP server.
 *
 * Keeping server startup separate from Express application
 * configuration makes the app easier to test and reuse.
 */
const server = app.listen(env.PORT, () => {
  console.log(`GetMyLPA server is running on http://localhost:${env.PORT}`);
});

/*
 * Gracefully shut down the server when the process receives
 * a termination signal.
 *
 * This becomes important when deploying to containers or
 * cloud platforms where processes may be restarted.
 */

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down...`);

  server.close((err) => {
    // Stops accepting new connections
    if (err) {
      console.log('Error during HTTP server closure', err);
      process.exit(1); // Exits with failure if the server failed to close cleanly
    }
    console.log('HTTP server is closed');

    //  Closes database connections or other resources here if needed
    // e.g., await db.disconnect();
    process.exit(0); //exits with success

    // Fallback timeout: Force exit if cleanup takes too long (e.g., hanging connections)
    setTimeout(() => {
      console.error(
        'Could not close connections in time, forcefully shutting down',
      );
      process.exit(1); // Exit with failure if the server failed to close cleanly
    }, 10000); // 10 seconds
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
