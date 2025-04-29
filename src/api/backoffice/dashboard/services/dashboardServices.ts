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
}

export const dashboardServices = new DashboardServices();
