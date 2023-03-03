import { ICreateBuildingCategory } from './types';

import { prisma } from '../../../../../../prisma';

export class BuildingCategoryAndMaintenanceServices {
  async createCategoriesAndMaintenances(data: ICreateBuildingCategory) {
    return prisma.buildingCategory.create({
      data,
    });
  }

  async findByBuildingId({ buildingId }: { buildingId: string }) {
    return prisma.buildingCategory.findFirst({
      where: {
        buildingId,
      },
    });
  }

  async deleteCategoriesAndMaintenances({ buildingId }: { buildingId: string }) {
    await prisma.buildingCategory.deleteMany({
      where: {
        buildingId,
      },
    });
  }
}
