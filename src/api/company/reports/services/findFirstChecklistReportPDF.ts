import { prisma } from '../../../../../prisma';

interface IFindFirstChecklistReportPDF {
  userId: string;
  orderBy?: 'asc' | 'desc';
}

export async function findFirstChecklistReportPDF({
  userId,
  orderBy = 'desc',
}: IFindFirstChecklistReportPDF) {
  const checklist = await prisma.checklistReportPDF.findFirst({
    where: { authorId: userId },
    orderBy: { createdAt: orderBy },
  });

  return checklist;
}
