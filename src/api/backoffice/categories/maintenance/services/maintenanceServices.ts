import { prisma } from '../../../../../utils/prismaClient';
import { ICreateMaintenanceHistory } from './types';

import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

export class MaintenanceServices {
  async create({ categoryId }: { categoryId: string }) {
    return prisma.maintenance.create({
      data: {
        categoryId,
      },
    });
  }

  async createMaintenanceHistory({
    maintenanceId,
    element,
    activity,
    frequency,
    responsible,
    source,
    delay,
    observation = null,
    period,
  }: ICreateMaintenanceHistory) {
    await this.findById({ maintenanceId });

    return prisma.maintenanceHistory.create({
      data: {
        maintenanceId,
        element,
        activity,
        delay,
        frequency,
        period,
        responsible,
        source,
        observation,
      },
    });
  }

  async findById({ maintenanceId }: { maintenanceId: string }) {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: maintenanceId },
    });

    validator.needExist([{ label: 'manutenção', variable: maintenance }]);

    return maintenance;
  }
}
