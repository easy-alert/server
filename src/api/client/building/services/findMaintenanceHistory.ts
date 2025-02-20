import type { MaintenancePriorityName } from '@prisma/client';
import { prisma } from '../../../../../prisma';
import { needExist } from '../../../../utils/newValidator';

interface IFindMaintenanceHistory {
  companyId: string;
  buildingId: string[] | undefined;
  userId: string[] | undefined;
  status: string[] | undefined;
  categoryIdFilter: string[] | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  showMaintenancePriority?: boolean | undefined;
  priorityFilter: MaintenancePriorityName | undefined;
}

export async function findMaintenanceHistory({
  companyId,
  buildingId,
  userId,
  status,
  showMaintenancePriority,
  startDate,
  endDate,
  categoryIdFilter,
  priorityFilter,
}: IFindMaintenanceHistory) {
  const maintenancesHistory = await prisma.maintenanceHistory.findMany({
    select: {
      id: true,
      notificationDate: true,
      resolutionDate: true,
      dueDate: true,
      inProgress: true,
      daysInAdvance: true,
      priority: showMaintenancePriority,

      Building: {
        select: {
          id: true,
          name: true,

          Banners: {
            select: {
              id: true,
              originalName: true,
              redirectUrl: true,
              url: true,
            },
          },
        },
      },

      Maintenance: {
        select: {
          id: true,
          element: true,
          frequency: true,
          activity: true,
          period: true,

          Category: {
            select: {
              id: true,
              name: true,
              categoryTypeId: true,
            },
          },

          FrequencyTimeInterval: {
            select: {
              unitTime: true,
              singularLabel: true,
              pluralLabel: true,
            },
          },

          PeriodTimeInterval: {
            select: {
              unitTime: true,
              singularLabel: true,
              pluralLabel: true,
            },
          },

          MaintenanceType: {
            select: {
              id: true,
              name: true,
            },
          },

          MaintenanceAdditionalInformation: {
            select: {
              userId: true,
              information: true,
            },
          },
        },
      },

      MaintenancesStatus: {
        select: {
          name: true,
          pluralLabel: true,
          singularLabel: true,
        },
      },
    },

    where: {
      Company: {
        id: companyId,
      },

      buildingId: {
        in: buildingId,
      },

      priorityName: priorityFilter,

      MaintenancesStatus: {
        name: {
          in: status,
        },
      },

      Maintenance: {
        categoryId: {
          in: categoryIdFilter,
        },

        MaintenanceAdditionalInformation: {
          every: {
            userId: {
              in: userId,
            },
          },
        },
      },

      OR: [
        { notificationDate: { lte: endDate, gte: startDate } },
        { resolutionDate: { lte: endDate, gte: startDate } },
      ],
    },
  });

  needExist([
    {
      label: 'histórico de manutenção',
      variable: maintenancesHistory,
    },
  ]);

  return maintenancesHistory;
}
