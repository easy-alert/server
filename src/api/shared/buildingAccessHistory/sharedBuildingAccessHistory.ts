import { prisma } from '../../../../prisma';

import { companyServices } from '../../backoffice/users/accounts/services/companyServices';

class SharedBuildingAccessHistoryService {
  async create({ buildingId, key }: { buildingId: string; key: string }) {
    await prisma.buildingAccessHistory.create({
      data: {
        buildingId,
        key,
      },
    });
  }

  async listByCompanyId({
    accessHistoryKey,
    companyId,
  }: {
    companyId: string;
    accessHistoryKey: 'client';
  }) {
    await companyServices.findById({ companyId });

    return prisma.company.findFirst({
      select: {
        Buildings: {
          select: {
            id: true,
            name: true,
            BuildingsAccessHistory: {
              select: {
                id: true,
                key: true,
                createdAt: true,
              },
              where: {
                key: accessHistoryKey,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
      where: {
        id: companyId,
      },
    });
  }
}

export const sharedBuildingAccessHistoryService = new SharedBuildingAccessHistoryService();
