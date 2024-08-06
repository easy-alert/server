import { Response, Request } from 'express';
import { prisma } from '../../../../../../prisma';

export async function listReportPdfs(req: Request, res: Response) {
  const pdfs = await prisma.maintenanceReportPdf.findMany({
    select: {
      author: { select: { name: true } },
      createdAt: true,
      id: true,
      status: true,
      url: true,
      name: true,
    },
    where: { authorCompanyId: req.Company.id },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json({ pdfs });
}
