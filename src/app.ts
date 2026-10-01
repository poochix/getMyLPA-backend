import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from '@/config/env.js';
import morgan from 'morgan';
import { authRouter } from './modules/auth/auth.route.js';

const app = express();

/*
 * Security middleware.
 *
 * Helmet sets a collection of HTTP response headers that help
 * protect the application against several common web vulnerabilities.
 */
app.use(
  helmet(
    //     {
    //     contentSecurityPolicy: {
    //       directives: {
    //         ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    //         // Allow connections to your own server and DevTools paths
    //         "connect-src": ["'self'", "http://localhost:8000", "chrome-extension://*"],
    //       },
    //     },
    //   }
  ),
);

/*
 * CORS configuration.
 *
 * Only the configured frontend origin is allowed to make
 * browser-based requests to the API.
 */
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// Requests Logging (Morgan)
// Automatically logs incoming HTTP requests to your terminal console
// 'dev' gives a clean, color-coded output for development

app.use(morgan('dev'));

/*
 * Parse incoming JSON request bodies.
 *
 * Example:
 *
 * POST /api/v1/users
 * {
 *   "email": "user@example.com"
 * }
 *
 * becomes available through req.body.
 */

app.use(express.json());

/*
 * Parse URL-encoded request bodies.
 *
 * This is useful for form submissions and other clients
 * that send application/x-www-form-urlencoded data.
 */
app.use(express.urlencoded({ extended: true }));

/*
 * Basic health-check endpoint.
 *
 * Used by developers, deployment platforms, and monitoring
 * systems to verify that the API process is running.
 */

app.use('/api/v1/auth', authRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'GetMyLpa API is healthy',
  });
});

export { app };
