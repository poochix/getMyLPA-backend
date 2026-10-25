import { prisma } from '@/lib/prisma.js';

async function testDatabaseConnection(): Promise<void> {
  try {
    // Execute a lightweight query against PostgreSQL.
    // This verifies that the application can communicate
    // with the database through Prisma's PostgreSQL adapter.
    const result = await prisma.$queryRaw<
      Array<{ current_time: Date; database_name: string }>
    >`
          SELECT 
          CURRENT_TIMESTAMP AS current_time,
          current_database() As database_name 
        `;

    console.log('Database connection successfull');
    console.log('Database:', result[0]?.database_name);
    console.log('Database time:', result[0]?.current_time);
  } catch (error: unknown) {
    // Print the error for local debugging without printing
    // the database connection string or credentials.
    console.log('Database connection failed');

    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exitCode = 1;
  } finally {
    // Close the Prisma connection pool so the script exits.
    await prisma.$disconnect();
  }
}

await testDatabaseConnection();
