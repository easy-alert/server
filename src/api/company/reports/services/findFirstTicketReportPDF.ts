import { prisma } from '../../../../../prisma';

interface IFindFirstTicketReportPDF {
  userId: string;
  orderBy?: 'asc' | 'desc';
}

export async function findFirstTicketReportPDF({
  userId,
  orderBy = 'desc',
}: IFindFirstTicketReportPDF) {
  const ticket = await prisma.ticketReportPDF.findFirst({
    where: { authorId: userId },
    orderBy: { createdAt: orderBy },
  });

  return ticket;
}
