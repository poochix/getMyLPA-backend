import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  // Use a stable email so rerunning the seed does not create
  // duplicate development users.
  const user = await prisma.user.upsert({
    where: {
      email: 'developer@example.com',
    },
    update: {},
    create: {
      name: 'Development User',
      email: 'developer@example.com',
      passwordHash: 'NOT_A_REAL_PASSWORD_HASH',
    },
  });

  // Use a stable storage key to make this operation repeatable.
  const resume = await prisma.resume.upsert({
    where: {
      storageKey: 'development/sample-resume.pdf',
    },
    update: {},
    create: {
      userId: user.id,
      originalFileName: 'sample-resume.pdf',
      storageKey: 'development/sample-resume.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1024,
      status: 'PROCESSED',
    },
  });

  // Create one analysis record if it doesn't already exist.
  const existingAnalysis = await prisma.resumeAnalysis.findFirst({
    where: {
      resumeId: resume.id,
      provider: 'seed',
      model: 'development-fixture',
    },
  });

  if (!existingAnalysis) {
    await prisma.resumeAnalysis.create({
      data: {
        resumeId: resume.id,
        status: 'COMPLETED',
        provider: 'seed',
        model: 'development-fixture',
        result: {
          overallScore: 75,
          skills: ['JavaScript', 'React', 'Node.js'],
          recommendations: [
            'Add measurable achievements to project descriptions.',
            'Highlight relevant technical skills.',
          ],
        },
        completedAt: new Date(),
      },
    });
  }

  console.log('Development seed completed successfully.');
}

main()
  .catch((error: unknown) => {
    console.error('Development seed failed.');

    if (error instanceof Error) {
      console.error(error.message);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
