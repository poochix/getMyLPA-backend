import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '@/config/env.js';
import { PrismaClient } from '../generated/prisma/client.js';

// Configure Prisma to communicate with PostgreSQL through
// the official PostgreSQL driver adapter.
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

// Export one reusable Prisma Client for the entire application.
// Repositories will import this instance instead of creating
// their own database clients.
export const prisma = new PrismaClient({
  adapter,
});
