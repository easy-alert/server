/* eslint-disable no-underscore-dangle */
import type { TicketStatusName } from '@prisma/client';

import { prisma } from '../../../../../prisma';

import type { IDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';

interface IMaintenance {
  id: string;
  count: number;
  allCount: number;
  rating: number;
  data: {
    id: string;
    Category: {
      name: string;
    };
    element: string;
    activity: string;
    frequency: number;
    FrequencyTimeInterval: {
      pluralLabel: string;
      singularLabel: string;
    };
    period: number;
    PeriodTimeInterval: {
      pluralLabel: string;
      singularLabel: string;
    };
    delay: number;
    DelayTimeInterval: {
      pluralLabel: string;
      singularLabel: string;
    };
    responsible: string;
    observation: string | null;
  } | null;
}

interface IMaintenanceData {
  completed: IMaintenance[];
  expired: IMaintenance[];
}

function customSort(array: IMaintenance[]) {
  array.sort((a, b) => {
    if (a.count !== b.count) {
      return b.count - a.count;
    }
    if (a.allCount !== b.allCount) {
      return b.allCount - a.allCount;
    }
    return b.rating - a.rating;
  });
}

export class DashboardServices {
  async dashboardFilters({
    buildingsIds,
    companyId,
  }: {
    buildingsIds?: string[];
    companyId: string;
  }) {
    const [buildingsData, defaultCategories, companyCategories, companyCategories2] =
      await prisma.$transaction([
        prisma.building.findMany({
          select: {
            name: true,
          },

          orderBy: {
            name: 'asc',
          },

          where: {
            id: {
              in: buildingsIds,
            },

            companyId,
          },
        }),

        prisma.category.findMany({
          select: {
            name: true,
          },
          where: {
            ownerCompanyId: null,
          },
          orderBy: {
            name: 'asc',
          },
        }),

        prisma.category.findMany({
          select: {
            name: true,
          },
          where: {
            ownerCompanyId: companyId,
          },
          orderBy: {
            name: 'asc',
          },
        }),

        prisma.maintenanceHistory.findMany({
          select: {
            Maintenance: {
              select: {
                Category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },

          orderBy: {
            Maintenance: {
              Category: {
                name: 'asc',
              },
            },
          },

          where: {
            Building: {
              companyId,
            },
          },
        }),
      ]);

    return {
      buildingsData,
      categoriesData: [
        // ...defaultCategories,
        // ...companyCategories,
        ...companyCategories2,
      ],
    };
  }

  async maintenancesCountAndCost({
    filter,
    maintenanceType,
  }: {
    filter: IDashboardFilter;
    maintenanceType: 'common' | 'occasional' | undefined;
  }) {
    const maintenancesData = await prisma.maintenanceHistory.findMany({
      select: {
        MaintenanceReport: {
          select: {
            cost: true,
          },
        },
      },

      where: {
        ownerCompanyId: filter.companyId,
        resolutionDate: filter.period,

        Building: {
          name: filter.buildings,
        },

        Maintenance: {
          Category: {
            name: filter.categories,
          },

          MaintenanceType: { name: maintenanceType },
        },

        MaintenancesStatus: {
          OR: [
            {
              name: 'completed',
            },
            {
              name: 'overdue',
            },
          ],
        },
      },
    });

    const maintenancesCost = maintenancesData
      .map((data) => data.MaintenanceReport[0].cost)
      .reduce((acc, cost) => (acc ?? 0) + (cost ?? 0), 0);

    return {
      maintenancesCount: maintenancesData.length,
      maintenancesCost,
    };
  }

  async maintenanceByTimeLine({ filter }: { filter: IDashboardFilter }) {
    const [timeLinePending, timeLineCompleted, timeLineExpired] = await Promise.all([
      prisma.maintenanceHistory.groupBy({
        by: ['notificationDate'],
        _count: {
          notificationDate: true,
        },

        orderBy: {
          notificationDate: 'desc',
        },

        where: {
          ownerCompanyId: filter.companyId,
          notificationDate: filter.period,

          Building: {
            name: filter.buildings,
          },

          Maintenance: {
            Category: {
              name: filter.categories,
            },
          },

          MaintenancesStatus: {
            name: 'pending',
          },
        },
      }),

      prisma.maintenanceHistory.groupBy({
        by: ['resolutionDate'],

        _count: {
          resolutionDate: true,
        },

        orderBy: {
          resolutionDate: 'desc',
        },

        where: {
          ownerCompanyId: filter.companyId,
          resolutionDate: filter.period,

          Building: {
            name: filter.buildings,
          },

          Maintenance: {
            Category: {
              name: filter.categories,
            },
          },

          MaintenancesStatus: {
            OR: [
              {
                name: 'completed',
              },
              {
                name: 'overdue',
              },
            ],
          },
        },
      }),

      prisma.maintenanceHistory.groupBy({
        by: ['dueDate'],

        _count: {
          dueDate: true,
        },

        orderBy: {
          dueDate: 'desc',
        },

        where: {
          ownerCompanyId: filter.companyId,
          dueDate: filter.period,

          Building: {
            name: filter.buildings,
          },

          Maintenance: {
            Category: {
              name: filter.categories,
            },
          },

          MaintenancesStatus: {
            name: 'expired',
          },
        },
      }),
    ]);

    return { timeLinePending, timeLineCompleted, timeLineExpired };
  }

  async maintenancesByStatus({ filter }: { filter: IDashboardFilter }) {
    const [completedMaintenances, expiredMaintenances, pendingMaintenances] =
      await prisma.$transaction([
        prisma.maintenanceHistory.count({
          where: {
            ownerCompanyId: filter.companyId,
            resolutionDate: filter.period,

            Building: {
              name: filter.buildings,
            },

            Maintenance: {
              Category: {
                name: filter.categories,
              },
            },

            MaintenancesStatus: {
              OR: [
                {
                  name: 'completed',
                },
                {
                  name: 'overdue',
                },
              ],
            },
          },
        }),

        prisma.maintenanceHistory.count({
          where: {
            ownerCompanyId: filter.companyId,
            dueDate: filter.period,

            Building: {
              name: filter.buildings,
            },

            Maintenance: {
              Category: {
                name: filter.categories,
              },
            },

            MaintenancesStatus: {
              name: 'expired',
            },
          },
        }),

        prisma.maintenanceHistory.count({
          where: {
            ownerCompanyId: filter.companyId,
            notificationDate: filter.period,

            Building: {
              name: filter.buildings,
            },

            Maintenance: {
              Category: {
                name: filter.categories,
              },
            },

            MaintenancesStatus: {
              name: 'pending',
            },
          },
        }),
      ]);

    return { completedMaintenances, expiredMaintenances, pendingMaintenances };
  }

  async maintenancesMostCompletedExpired({
    filter,
    quantityToReturn,
  }: {
    filter: IDashboardFilter;
    quantityToReturn: number;
  }) {
    const maintenancesBaseData: IMaintenanceData = {
      completed: [],
      expired: [],
    };

    // #region find most completed and expired maintenances

    const [maintenancesCompletedCount, maintenancesExpiredCount] = await prisma.$transaction([
      prisma.maintenanceHistory.groupBy({
        by: ['maintenanceId'],
        _count: {
          notificationDate: true,
        },
        orderBy: {
          _count: {
            notificationDate: 'desc',
          },
        },
        where: {
          notificationDate: filter.period,
          Building: {
            NotificationsConfigurations: filter.responsible,
            name: filter.buildings,
          },
          ownerCompanyId: filter.companyId,
          Maintenance: {
            Category: {
              name: filter.categories,
            },

            // não tras avulsa no mais e menos realizadas
            MaintenanceType: {
              name: {
                not: 'occasional',
              },
            },
          },
          MaintenancesStatus: {
            OR: [
              {
                name: 'completed',
              },
              {
                name: 'overdue',
              },
            ],
          },
        },
      }),

      prisma.maintenanceHistory.groupBy({
        by: ['maintenanceId'],
        _count: {
          dueDate: true,
        },
        orderBy: {
          _count: {
            dueDate: 'desc',
          },
        },
        where: {
          dueDate: filter.period,
          Building: {
            NotificationsConfigurations: filter.responsible,
            name: filter.buildings,
          },
          Maintenance: {
            Category: {
              name: filter.categories,
            },

            // não tras avulsa no mais e menos realizadas
            MaintenanceType: {
              name: {
                not: 'occasional',
              },
            },
          },
          ownerCompanyId: filter.companyId,
          MaintenancesStatus: {
            name: 'expired',
          },
        },
      }),
    ]);

    maintenancesCompletedCount.forEach((maintenance) =>
      maintenancesBaseData.completed.push({
        id: maintenance.maintenanceId,
        // @ts-ignore
        count: maintenance._count?.notificationDate,
        allCount: 0,
        rating: 0,
        data: null,
      }),
    );

    maintenancesExpiredCount.forEach((maintenance) =>
      maintenancesBaseData.expired.push({
        id: maintenance.maintenanceId,
        // @ts-ignore
        count: maintenance._count?.dueDate,
        allCount: 0,
        rating: 0,
        data: null,
      }),
    );

    // #endregion

    // #region getAllMaintenancesCount

    // #region completed
    const mostCompletedMaintenancesAllCountTransaction = maintenancesBaseData.completed.map(
      (data) =>
        prisma.maintenanceHistory.groupBy({
          by: ['maintenanceId'],
          _count: {
            notificationDate: true,
          },
          orderBy: {
            _count: {
              notificationDate: 'desc',
            },
          },
          where: {
            Building: {
              NotificationsConfigurations: filter.responsible,
              name: filter.buildings,
            },
            Maintenance: {
              Category: {
                name: filter.categories,
              },
            },

            notificationDate: filter.period,
            ownerCompanyId: filter.companyId,
            maintenanceId: data.id,
          },
        }),
    );

    const maintenanceCompletedTotalCount = await prisma.$transaction(
      mostCompletedMaintenancesAllCountTransaction,
    );

    maintenanceCompletedTotalCount.forEach((base) => {
      base.forEach((maintenanceTotalCount) => {
        const maintenanceFoundIndex = maintenancesBaseData.completed.findIndex(
          (maintenanceData) => maintenanceData.id === maintenanceTotalCount.maintenanceId,
        );

        maintenancesBaseData.completed[maintenanceFoundIndex].allCount =
          maintenanceTotalCount._count.notificationDate;

        const completedCount = maintenancesBaseData.completed[maintenanceFoundIndex].count;
        const totalCount = maintenanceTotalCount._count.notificationDate;

        maintenancesBaseData.completed[maintenanceFoundIndex].rating = completedCount / totalCount;
      });
    });

    // #endregion

    // #region expired
    const mostExpiredMaintenancesAllCountTransaction = maintenancesBaseData.expired.map((data) =>
      prisma.maintenanceHistory.groupBy({
        by: ['maintenanceId'],
        _count: {
          notificationDate: true,
        },
        orderBy: {
          _count: {
            notificationDate: 'desc',
          },
        },
        where: {
          Building: {
            NotificationsConfigurations: filter.responsible,
            name: filter.buildings,
          },
          Maintenance: {
            Category: {
              name: filter.categories,
            },
          },

          notificationDate: filter.period,
          ownerCompanyId: filter.companyId,
          maintenanceId: data.id,
        },
      }),
    );

    const maintenanceExpiredTotalCount = await prisma.$transaction(
      mostExpiredMaintenancesAllCountTransaction,
    );

    maintenanceExpiredTotalCount.forEach((base) => {
      base.forEach((maintenanceTotalCount) => {
        const maintenanceFoundIndex = maintenancesBaseData.expired.findIndex(
          (maintenanceData) => maintenanceData.id === maintenanceTotalCount.maintenanceId,
        );

        maintenancesBaseData.expired[maintenanceFoundIndex].allCount =
          maintenanceTotalCount._count.notificationDate;

        const expiredCount = maintenancesBaseData.expired[maintenanceFoundIndex].count;
        const totalCount = maintenanceTotalCount._count.notificationDate;

        maintenancesBaseData.expired[maintenanceFoundIndex].rating = expiredCount / totalCount;
      });
    });

    // #endregion

    // #endregion

    // #region select winner maintenances

    customSort(maintenancesBaseData.completed);
    customSort(maintenancesBaseData.expired);

    const maintenanceIds: string[] = [];

    const maintenancesData: IMaintenanceData = {
      completed: [],
      expired: [],
    };

    for (let i = 0; i < quantityToReturn; i++) {
      if (maintenancesBaseData.completed[i]) {
        maintenancesData.completed.push(maintenancesBaseData.completed[i]);
        maintenanceIds.push(maintenancesBaseData.completed[i].id);
      }
      if (maintenancesBaseData.expired[i]) {
        maintenancesData.expired.push(maintenancesBaseData.expired[i]);
        maintenanceIds.push(maintenancesBaseData.expired[i].id);
      }
    }

    const maintenancesInfos = await prisma.maintenance.findMany({
      select: {
        id: true,
        Category: {
          select: {
            name: true,
          },
        },
        element: true,
        activity: true,
        frequency: true,
        FrequencyTimeInterval: {
          select: {
            pluralLabel: true,
            singularLabel: true,
          },
        },
        period: true,
        PeriodTimeInterval: {
          select: {
            pluralLabel: true,
            singularLabel: true,
          },
        },
        delay: true,
        DelayTimeInterval: {
          select: {
            pluralLabel: true,
            singularLabel: true,
          },
        },
        responsible: true,
        observation: true,
      },
      where: {
        id: {
          in: maintenanceIds,
        },
      },
    });

    for (let i = 0; i < maintenancesData.completed.length; i++) {
      const maintenanceFound = maintenancesInfos.find(
        (maintenanceInfo) => maintenanceInfo.id === maintenancesData.completed[i].id,
      );
      if (maintenanceFound) {
        maintenancesData.completed[i].data = maintenanceFound;
      }
    }

    for (let i = 0; i < maintenancesData.expired.length; i++) {
      const maintenanceFound = maintenancesInfos.find(
        (maintenanceInfo) => maintenanceInfo.id === maintenancesData.expired[i].id,
      );
      if (maintenanceFound) {
        maintenancesData.expired[i].data = maintenanceFound;
      }
    }

    // #endregion

    return { maintenancesData };
  }

  async ticketsCountAndCost({
    filter,
    ticketStatus,
  }: {
    filter: IDashboardFilter;
    ticketStatus: TicketStatusName | undefined;
  }) {
    const ticketsData = await prisma.ticket.aggregate({
      _count: { id: true },
      where: {
        statusName: ticketStatus,
        createdAt: filter.period,
        building: {
          name: filter.buildings,
          companyId: filter.companyId,
        },
      },
    });

    return {
      ticketsCount: ticketsData._count.id,
    };
  }

  async ticketsByServiceType({ filter }: { filter: IDashboardFilter }) {
    const [ticketsServicesType, serviceTypes] = await Promise.all([
      prisma.ticketServiceType.groupBy({
        by: ['serviceTypeId'],
        _count: {
          ticketId: true,
        },
        where: {
          ticket: {
            createdAt: filter.period,
            building: {
              name: filter.buildings,
              companyId: filter.companyId,
            },
          },
        },
      }),

      prisma.serviceType.findMany(),
    ]);

    return { ticketsServicesType, serviceTypes };
  }
}

export const dashboardServices = new DashboardServices();
