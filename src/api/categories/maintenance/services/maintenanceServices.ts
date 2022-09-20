import { prisma } from '../../../../utils/prismaClient';
import { Validator } from '../../../../utils/validator/validator';
import { ICreateMaintenanceHistory } from '../../types';

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
    return prisma.maintenance.findUnique({
      where: {
        id: maintenanceId,
      },
    });
  }

  async delete({ maintenanceId }: { maintenanceId: string }) {
    const maintenance = await this.findById({ maintenanceId });
    validator.needExists([
      { label: 'ID da manutenção', variable: maintenance },
    ]);

    await prisma.maintenance.delete({
      where: { id: maintenanceId },
    });
  }
}
