import { prisma } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';
import {
  ICreateMaintenanceReports,
  ICreateMaintenanceReportsHistory,
  IEditMaintenanceReports,
} from './types';

const validator = new Validator();

export class SharedMaintenanceReportsServices {
  async create({ data }: ICreateMaintenanceReports) {
    return prisma.maintenanceReport.create({
      data,
    });
  }

  async getReportByMaintenanceHistoryId({
    maintenanceHistoryId,
  }: {
    maintenanceHistoryId: string;
  }) {
    return prisma.maintenanceReport.findFirst({
      select: {
        id: true,
      },
      where: {
        maintenanceHistoryId,
      },
    });
  }

  async edit({ data, maintenanceReportId }: IEditMaintenanceReports) {
    return prisma.maintenanceReport.update({
      data,
      where: { id: maintenanceReportId },
    });
  }

  async getReportVersion({ maintenanceReportId }: { maintenanceReportId: string }) {
    return prisma.maintenanceReport.findFirst({
      select: {
        version: true,
        cost: true,
      },
      where: { id: maintenanceReportId },
    });
  }

  async getAllReportVersions({ maintenanceHistoryId }: { maintenanceHistoryId: string }) {
    return prisma.maintenanceReportHistory.findMany({
      select: {
        origin: true,
        version: true,
        createdAt: true,
        cost: true,
        id: true,
        observation: true,
        ReportAnnexes: {
          select: {
            name: true,
            originalName: true,
            url: true,
            id: true,
          },
        },
        ReportImages: {
          select: {
            name: true,
            originalName: true,
            url: true,
            id: true,
          },
        },
      },
      where: { maintenanceHistoryId },
      orderBy: {
        version: 'desc',
      },
    });
  }

  async deleteAnnexAndImages({ maintenanceReportId }: { maintenanceReportId: string }) {
    await prisma.maintenanceReportAnnexes.deleteMany({
      where: {
        maintenanceReportId,
      },
    });
    await prisma.maintenanceReportImages.deleteMany({
      where: {
        maintenanceReportId,
      },
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
        inProgress: true,
        daysInAdvance: true,
        priorityName: true,
        priority: true,
        showToResident: true,
        serviceOrderNumber: true,

        MaintenanceReportProgress: {
          select: {
            id: true,
            cost: true,
            observation: true,

            ReportImagesProgress: {
              select: {
                name: true,
                originalName: true,
                url: true,
              },
            },

            ReportAnnexesProgress: {
              select: {
                name: true,
                originalName: true,
                url: true,
              },
            },
          },
        },

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
            id: true,
            guestCanCompleteMaintenance: true,
          },
        },

        Maintenance: {
          select: {
            id: true,
            element: true,
            activity: true,
            responsible: true,
            source: true,
            observation: true,
            period: true,
            frequency: true,
            instructions: { select: { name: true, url: true } },

            Category: {
              select: {
                name: true,
              },
            },

            FrequencyTimeInterval: {
              select: {
                pluralLabel: true,
                singularLabel: true,
                unitTime: true,
              },
            },

            PeriodTimeInterval: {
              select: {
                singularLabel: true,
                pluralLabel: true,
                unitTime: true,
              },
            },

            MaintenanceType: {
              select: {
                name: true,
              },
            },
          },
        },

        Users: {
          select: {
            User: {
              select: {
                id: true,
                image: true,
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
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

    const additionalInfo = await prisma.maintenanceAdditionalInformation.findFirst({
      select: {
        information: true,
        user: true,
      },

      where: {
        buildingId: maintenanceHistory?.Building.id,
        maintenanceId: maintenanceHistory?.Maintenance.id,
      },
    });

    return {
      ...maintenanceHistory!,
      additionalInfo: additionalInfo?.information || '',
      userResponsible: additionalInfo?.user || undefined,
    };
  }
}
