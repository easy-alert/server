/* eslint-disable no-underscore-dangle */
import { prisma } from '../../../../../prisma';
import { IDashboardFilter } from '../controllers';

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

export class DashboardServices {
  async getDashboardData(filter: IDashboardFilter) {
    const [
      timeLineCompleted,
      timeLineExpired,
      investmentsData,
      completedMaintenancesScore,
      expiredMaintenancesScore,
      pendingMaintenancesScore,
    ] = await prisma.$transaction([
      // #region timeLine
      prisma.maintenanceHistory.groupBy({
        by: ['resolutionDate'],
        _count: {
          resolutionDate: true,
        },

        orderBy: {
          resolutionDate: 'desc',
        },
        where: {
          resolutionDate: filter.period,

          Building: {
            NotificationsConfigurations: filter.responsibles,

            name: filter.buildings,
          },
          ownerCompanyId: filter.companyId,

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
          dueDate: filter.period,
          Building: {
            NotificationsConfigurations: filter.responsibles,
            name: filter.buildings,
          },
          ownerCompanyId: filter.companyId,

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
      // #endregion

      //  #region investments
      prisma.maintenanceReport.aggregate({
        _sum: { cost: true },
        where: {
          MaintenanceHistory: {
            resolutionDate: filter.period,
            Building: {
              NotificationsConfigurations: filter.responsibles,
              name: filter.buildings,
            },
            ownerCompanyId: filter.companyId,

            Maintenance: {
              Category: {
                name: filter.categories,
              },
            },
          },
        },
      }),
      // #endregion

      // #region score

      prisma.maintenanceHistory.aggregate({
        _count: { resolutionDate: true },

        where: {
          resolutionDate: filter.period,
          Building: {
            NotificationsConfigurations: filter.responsibles,
            name: filter.buildings,
          },
          ownerCompanyId: filter.companyId,

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

      prisma.maintenanceHistory.aggregate({
        _count: { dueDate: true },
        where: {
          dueDate: filter.period,
          Building: {
            NotificationsConfigurations: filter.responsibles,
            name: filter.buildings,
          },
          ownerCompanyId: filter.companyId,

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

      prisma.maintenanceHistory.aggregate({
        _count: { notificationDate: true },
        where: {
          notificationDate: filter.period,
          Building: {
            NotificationsConfigurations: filter.responsibles,
            name: filter.buildings,
          },
          ownerCompanyId: filter.companyId,

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

      // #endregion
    ]);

    return {
      timeLineCompleted,
      timeLineExpired,
      investmentsData,
      completedMaintenancesScore,
      expiredMaintenancesScore,
      pendingMaintenancesScore,
    };
  }

  async getMostCompletedAndExpiredMaintenances({
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
            NotificationsConfigurations: filter.responsibles,
            name: filter.buildings,
          },
          ownerCompanyId: filter.companyId,
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
            NotificationsConfigurations: filter.responsibles,
            name: filter.buildings,
          },
          Maintenance: {
            Category: {
              name: filter.categories,
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
              NotificationsConfigurations: filter.responsibles,
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
    const maintenancecompletedTotalCount = await prisma.$transaction(
      mostCompletedMaintenancesAllCountTransaction,
    );

    maintenancecompletedTotalCount.forEach((base) => {
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
            NotificationsConfigurations: filter.responsibles,
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

    const maintenanceexpiredTotalCount = await prisma.$transaction(
      mostExpiredMaintenancesAllCountTransaction,
    );

    maintenanceexpiredTotalCount.forEach((base) => {
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

  async listAuxiliaryData(companyId: string) {
    const [buildingsData, defaultCategories, companyCategories] = await prisma.$transaction([
      prisma.building.findMany({
        select: {
          name: true,
          NotificationsConfigurations: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        where: {
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
    ]);
    return { buildingsData, categoriesData: [...defaultCategories, ...companyCategories] };
  }
}

export const dashboardServices = new DashboardServices();
