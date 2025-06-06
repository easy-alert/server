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
  search?: string;
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
  search,
}: IFindMaintenanceHistory) {
  const splittedSearch =
    search
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) || [];

  const searchConditions: any[] = [];

  splittedSearch.forEach((keyword) => {
    if (keyword) {
      const conditions = [
        { Building: { name: { contains: keyword, mode: 'insensitive' } } },
        { Maintenance: { element: { contains: keyword, mode: 'insensitive' } } },
        { Maintenance: { activity: { contains: keyword, mode: 'insensitive' } } },
        { Maintenance: { Category: { name: { contains: keyword, mode: 'insensitive' } } } },
        { MaintenancesStatus: { singularLabel: { contains: keyword, mode: 'insensitive' } } },
        {
          Maintenance: {
            instructions: { some: { name: { contains: keyword, mode: 'insensitive' } } },
          },
        },
        {
          serviceOrderNumber: {
            equals: Number.isInteger(Number(keyword)) ? Number(keyword) : undefined,
          },
        },
      ];

      searchConditions.push(...conditions);
    }
  });

  const maintenancesHistory = await prisma.maintenanceHistory.findMany({
    select: {
      id: true,
      notificationDate: true,
      resolutionDate: true,
      dueDate: true,
      inProgress: true,
      daysInAdvance: true,
      priority: showMaintenancePriority,
      serviceOrderNumber: true,

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

      Building: {
        id: {
          in: buildingId,
        },
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

      ...(searchConditions.length > 1 && {
        OR: [...searchConditions],
      }),
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
