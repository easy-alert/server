import { prisma } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';
import { ICreateMaintenanceReports, ICreateMaintenanceReportsHistory } from './types';

const validator = new Validator();

export class SharedMaintenanceReportsServices {
  async create({ data }: ICreateMaintenanceReports) {
    return prisma.maintenanceReport.create({
      data,
    });
  }

  async createHistory({ data }: ICreateMaintenanceReportsHistory) {
    return prisma.maintenanceReportHistory.create({
      data,
    });
  }

  async listMaintenanceById({ maintenanceHistoryId }: { maintenanceHistoryId: string }) {
    const maintenanceHistory = await prisma.maintenanceHistory.findFirst({
      select: {
        id: true,
        notificationDate: true,
        dueDate: true,
        resolutionDate: true,

        MaintenanceReport: {
          select: {
            id: true,
            cost: true,
            observation: true,

            ReportAnnexes: {
              select: {
                name: true,
                originalName: true,
                url: true,
              },
            },

            ReportImages: {
              select: {
                name: true,
                originalName: true,
                url: true,
              },
            },
          },
        },

        MaintenancesStatus: {
          select: {
            name: true,
          },
        },

        Building: {
          select: {
            name: true,
          },
        },

        Maintenance: {
          select: {
            Category: {
              select: {
                name: true,
              },
            },
            element: true,
            activity: true,
            responsible: true,
            source: true,
            observation: true,
          },
        },
      },

      where: {
        id: maintenanceHistoryId,
      },
    });

    validator.needExist([
      {
        label: 'Id do histórico de manutenção',
        variable: maintenanceHistory,
      },
    ]);

    return maintenanceHistory!;
  }
}
