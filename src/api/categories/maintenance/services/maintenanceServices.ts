import { prisma } from '../../../../utils/prismaClient';
import { ICreateMaintenanceHistory } from '../../types';

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
}
