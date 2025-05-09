import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdateChecklistReportPDF {
  updatedChecklistReportPDF: prismaTypes.ChecklistReportPDFUpdateArgs['data'];
}

export async function updateChecklistReportPDF({
  updatedChecklistReportPDF,
}: IUpdateChecklistReportPDF) {
  return prisma.checklistReportPDF.update({
    where: { id: String(updatedChecklistReportPDF.id) },
    data: updatedChecklistReportPDF,
  });
}
