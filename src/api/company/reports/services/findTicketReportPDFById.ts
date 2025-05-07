import { prisma } from '../../../../../prisma';

export async function findTicketReportPDFById({ reportPDFId }: { reportPDFId: string }) {
  return prisma.ticketReportPDF.findUnique({
    where: { id: reportPDFId },
  });
}
