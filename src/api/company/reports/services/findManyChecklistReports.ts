import { prisma } from '../../../../../prisma';

export async function findManyChecklistReports({ companyId }: { companyId: string }) {
  return prisma.checklistReportPDF.findMany({
    include: {
      author: { select: { name: true } },
    },

    where: { authorCompanyId: companyId },
    orderBy: { createdAt: 'desc' },
  });
}
