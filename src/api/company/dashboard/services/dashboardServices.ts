import { prisma } from '../../../../../prisma';
import { ITimeLine } from '../controllers';

export class DashboardServices {
  async getDashboardData(filter: ITimeLine) {
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
            NotificationsConfigurations: {
              some: {
                name: filter.responsibles,
              },
            },

            name: filter.buildings,
          },
          ownerCompanyId: filter.companyId,

          Maintenance: {
            Category: {
              name: filter.categories,
            },
          },

          MaintenancesStatus: {
            name: 'completed',
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
            NotificationsConfigurations: {
              some: {
                name: filter.responsibles,
              },
            },
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
              NotificationsConfigurations: {
                some: {
                  name: filter.responsibles,
                },
              },
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
            NotificationsConfigurations: {
              some: {
                name: filter.responsibles,
              },
            },
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
            NotificationsConfigurations: {
              some: {
                name: filter.responsibles,
              },
            },
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
            NotificationsConfigurations: {
              some: {
                name: filter.responsibles,
              },
            },
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
