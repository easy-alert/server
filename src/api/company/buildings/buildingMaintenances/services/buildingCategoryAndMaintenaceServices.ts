import { ICreateBuildingCategory } from './types';

import { prisma } from '../../../../../../prisma';

export class BuildingCategoryAndMaintenanceServices {
  async createCategoriesAndMaintenances(data: ICreateBuildingCategory) {
    await prisma.buildingCategory.create({
      data,
    });
  }

  async findByBuldingId({ buildingId }: { buildingId: string }) {
    return prisma.buildingCategory.findFirst({
      where: {
        buildingId,
      },
    });
  }

  async delteCategoriesAndMaintenances({ buildingId }: { buildingId: string }) {
    await prisma.buildingCategory.deleteMany({
      where: {
        buildingId,
      },
    });
  }
}
