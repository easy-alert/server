import { ICreateBuildingCategory } from './types';

import { prisma } from '../../../../../../../prisma';

export class BuildingCategoryServices {
  async createCategoriesAndMaintenances(data: ICreateBuildingCategory) {
    await prisma.buildingCategory.create({
      data,
    });
  }
}
