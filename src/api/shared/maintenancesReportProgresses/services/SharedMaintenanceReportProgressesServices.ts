import { Prisma } from '@prisma/client';
import { prisma } from '../../../../../prisma';

export class SharedMaintenanceReportProgressesServices {
  async create(args: Prisma.MaintenanceReportProgressCreateArgs) {
    await prisma.maintenanceReportProgress.deleteMany({
      where: {
        maintenanceHistoryId: args.data.maintenanceHistoryId,
      },
    });

    return prisma.maintenanceReportProgress.create(args);
  }

  async findByMaintenanceHistoryId(maintenanceHistoryId: string) {
    return prisma.maintenanceReportProgress.findUnique({
      select: {
        cost: true,
        observation: true,

        ReportAnnexesProgress: {
          select: {
            name: true,
            originalName: true,
            url: true,
          },
        },

        ReportImagesProgress: {
          select: {
            name: true,
            originalName: true,
            url: true,
          },
        },
      },
      where: {
        maintenanceHistoryId,
      },
    });
  }
}
