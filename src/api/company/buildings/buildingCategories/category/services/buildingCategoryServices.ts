import { ICreateBuildingCategory } from './types';

import { prisma } from '../../../../../../../prisma';

export class BuildingCategoryServices {
  async createCategoryAndMaintenances(data: ICreateBuildingCategory) {
    await prisma.buildingCategory.create({
      data,
    });
  }
}
