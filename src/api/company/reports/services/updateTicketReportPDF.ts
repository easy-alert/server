import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdateTicketReportPDF {
  updatedTicketReportPDF: prismaTypes.TicketReportPDFUpdateArgs['data'];
}

export async function updateTicketReportPDF({ updatedTicketReportPDF }: IUpdateTicketReportPDF) {
  return prisma.ticketReportPDF.update({
    where: { id: String(updatedTicketReportPDF.id) },
    data: updatedTicketReportPDF,
  });
}
