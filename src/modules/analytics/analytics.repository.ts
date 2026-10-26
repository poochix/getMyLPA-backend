import { prisma } from '@/lib/prisma.js';

export async function getResumeAnalyses(resumeId: string) {
  return prisma.$queryRaw<
    Array<{
      id: string;
      status: string;
      model: string | null;
      createdAt: Date;
    }>
  >`
    SELECT 
      id,
      status,
      model,
      "createdAt"
      FROM "ResumeAnalysis"
      WHERE "resumeId" = ${resumeId} :: uuid
      ORDER BY "createdAt" DESC

    `;
}
