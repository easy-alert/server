import type { MaintenancePriorityName } from '@prisma/client';
import { prisma, prismaTypes } from '../../../../../prisma';

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
  priorityFilter: MaintenancePriorityName[] | undefined;
  search?: string;
  typeFilter?: string[] | undefined;
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
  typeFilter,
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

  // Optimized select - keeping all necessary fields for frontend
  const maintenanceHistorySelect: prismaTypes.MaintenanceHistorySelect = {
    id: true,
    notificationDate: true,
    resolutionDate: true,
    dueDate: true,
    inProgress: true,
    priority: showMaintenancePriority,
    serviceOrderNumber: true,
    daysInAdvance: true,

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
        activity: true,
        period: true,
        frequency: true,

        Category: {
          select: {
            id: true,
            name: true,
            categoryTypeId: true,
          },
        },

        MaintenanceType: {
          select: {
            id: true,
            name: true,
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
  };

  const maintenanceHistoryWhere: prismaTypes.MaintenanceHistoryWhereInput = {
    Company: {
      id: companyId,
    },

    Building: {
      id: {
        in: buildingId,
      },
    },

    priorityName: {
      in: priorityFilter,
    },

    MaintenancesStatus: {
      name: {
        in: status,
      },
    },

    Maintenance: {
      categoryId: {
        in: categoryIdFilter,
      },

      MaintenanceType: {
        name: {
          in: typeFilter,
        },
      },

      MaintenanceAdditionalInformation: {
        every: {
          userId: {
            in: userId,
          },
        },
      },
    },

    ...(searchConditions.length > 1 && {
      OR: [...searchConditions],
    }),
  };

  const [pendingMaintenances, expiredMaintenances, completedMaintenances] =
    await prisma.$transaction([
      prisma.maintenanceHistory.findMany({
        select: maintenanceHistorySelect,
        orderBy: [{ dueDate: 'asc' }],

        where: {
          ...maintenanceHistoryWhere,

          MaintenancesStatus: {
            name: {
              in: status || ['pending'],
            },
          },
        },
      }),

      prisma.maintenanceHistory.findMany({
        select: maintenanceHistorySelect,
        orderBy: [{ notificationDate: 'asc' }],

        where: {
          ...maintenanceHistoryWhere,

          MaintenancesStatus: {
            name: {
              in: status || ['expired'],
            },
          },

          AND: [
            { notificationDate: { lte: endDate, gte: startDate } },
            { resolutionDate: { lte: endDate, gte: startDate } },
          ],
        },
      }),

      prisma.maintenanceHistory.findMany({
        select: maintenanceHistorySelect,
        orderBy: [{ resolutionDate: 'desc' }],

        where: {
          ...maintenanceHistoryWhere,

          MaintenancesStatus: {
            name: {
              in: status || ['completed'],
            },
          },
          notificationDate: { lte: endDate, gte: startDate },
          resolutionDate: { lte: endDate, gte: startDate },
        },
      }),
    ]);

  const maintenancesHistory = [
    ...pendingMaintenances,
    ...expiredMaintenances,
    ...completedMaintenances,
  ];

  needExist([
    {
      label: 'histórico de manutenção',
      variable: maintenancesHistory,
    },
  ]);

  return maintenancesHistory;
}
