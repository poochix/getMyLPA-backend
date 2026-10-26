import 'dotenv/config';

import { prisma } from '../lib/prisma.js';
import { getResumeAnalyses } from '../modules/analytics/analytics.repository.js';

async function main(): Promise<void> {
  // Find a resume created by our development seed.
  const resumes = await prisma.resume.findMany({
    where: {
      storageKey: 'development/sample-resume.pdf',
    },
    select: {
      id: true,
      originalFileName: true,
    },
  });

  const resume = resumes[0];

  if (!resume) {
    throw new Error('Seed resume not found. Run the development seed first.');
  }

  console.log('Testing parameterized SQL...');
  console.log('Resume:', resume.originalFileName);

  // The repository passes the ID as a parameter to PostgreSQL.
  const analyses = await getResumeAnalyses(resume.id);

  console.log('Analysis records returned:', analyses.length);
  console.log('Results:', analyses);
}

main()
  .catch((error: unknown) => {
    console.error('Parameterized SQL test failed.');

    if (error instanceof Error) {
      console.error(error.message);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
