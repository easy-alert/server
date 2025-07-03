/* eslint-disable no-underscore-dangle */
import { prisma } from '../../../../../prisma';

export class DashboardServices {
  async countCompanies({ companyStatus }: { companyStatus?: boolean }) {
    const companies = await prisma.company.count({
      where: {
        isBlocked: companyStatus,
      },
    });

    return companies;
  }

  async countBuildings({ buildingStatus }: { buildingStatus?: boolean }) {
    const buildings = await prisma.building.count({
      where: {
        isBlocked: buildingStatus,
      },
    });

    return buildings;
  }

  async countUsers({ userStatus }: { userStatus?: boolean }) {
    const users = await prisma.user.count({
      where: {
        isBlocked: userStatus,
      },
    });

    return users;
  }

  async rankingMostActiveCompanies() {
    // Calculate first and last day of previous month
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,

        _count: {
          select: {
            MaintenancesHistory: {
              where: {
                MaintenancesStatus: {
                  OR: [{ name: 'completed' }, { name: 'overdue' }],
                },

                resolutionDate: {
                  gte: firstDayLastMonth,
                  lte: lastDayLastMonth,
                },
              },
            },
          },
        },
      },

      where: {
        isBlocked: false,
      },

      // take,
    });

    return companies;
  }

}

export const dashboardServices = new DashboardServices();
