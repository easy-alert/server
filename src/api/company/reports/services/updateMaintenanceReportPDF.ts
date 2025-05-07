import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdateMaintenanceReportPDF {
  updatedMaintenanceReportPDF: prismaTypes.MaintenanceReportPdfUpdateArgs['data'];
}

export async function updateMaintenanceReportPDF({
  updatedMaintenanceReportPDF,
}: IUpdateMaintenanceReportPDF) {
  return prisma.maintenanceReportPdf.update({
    where: { id: String(updatedMaintenanceReportPDF.id) },
    data: updatedMaintenanceReportPDF,
  });
}
