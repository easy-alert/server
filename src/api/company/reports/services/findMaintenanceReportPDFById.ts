import { prisma } from '../../../../../prisma';

export async function findMaintenanceReportPDFById({ reportPDFId }: { reportPDFId: string }) {
  return prisma.maintenanceReportPdf.findUnique({
    where: { id: reportPDFId },
  });
}
