import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../prisma';

export async function createMaintenancesReportHistory(_req: Request, res: Response) {
  const reportIds = ['9bd5056d-4293-431f-8632-594895f05a97'];

  let allReports = await prisma.maintenanceReport.findMany({
    include: {
      ReportAnnexes: true,
      ReportImages: true,
      MaintenanceReportHistory: true,
    },

    where: {
      id: { in: reportIds },
    },
  });

  allReports = allReports.filter((report) => report.MaintenanceReportHistory.length === 0);

  const updatedReports: Prisma.MaintenanceReportHistoryUncheckedCreateInput[] = [];

  allReports.forEach((report) => {
    const updatedAnnex: any = [];
    report.ReportAnnexes.forEach((annex) => {
      updatedAnnex.push({
        name: annex.name,
        url: annex.url,
        originalName: annex.originalName,
      });
    });

    const updatedImages: any = [];
    report.ReportImages.forEach((annex) => {
      updatedImages.push({
        name: annex.name,
        url: annex.url,
        originalName: annex.originalName,
      });
    });

    updatedReports.push({
      maintenanceReportId: report.id,
      cost: report.cost,
      observation: report.observation,
      maintenanceHistoryId: report.maintenanceHistoryId,
      ReportAnnexes: {
        createMany: {
          data: updatedAnnex,
        },
      },
      ReportImages: {
        createMany: {
          data: updatedImages,
        },
      },
    });
  });

  for (let i = 0; i < updatedReports.length; i++) {
    const report = updatedReports[i];

    await prisma.maintenanceReportHistory.create({ data: report });
  }

  return res.sendStatus(200);
}
