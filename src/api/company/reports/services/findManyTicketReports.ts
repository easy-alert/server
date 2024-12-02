import { prisma } from '../../../../../prisma';

export async function findManyTicketsReports({ companyId }: { companyId: string }) {
  return prisma.ticketReportPDF.findMany({
    include: {
      author: { select: { name: true } },
    },

    where: { authorCompanyId: companyId },
    orderBy: { createdAt: 'desc' },
  });
}
