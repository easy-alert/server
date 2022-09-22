import { prisma } from '../../../../utils/prismaClient';
import {
  ICreateMaintenance,
  ICreateMaintenanceHistory,
  IEditMaintenance,
} from '../../types';
import { Validator } from '../../../../utils/validator/validator';
import { CategoryServices } from '../../category/services/categoryServices';

const validator = new Validator();
const categoryServices = new CategoryServices();

export class MaintenanceServices {
  async create({ categoryId, element }: ICreateMaintenance) {
    const category = await categoryServices.findById({ categoryId });
    validator.needExist([{ label: 'ID da categoria', variable: category }]);

    return prisma.maintenance.create({
      data: {
        categoryId,
        element,
      },
    });
  }

  async createMaintenanceHistory({
    maintenanceId,
    element,
    activity,
    frequency,
    frequencyTimeIntervalId,
    responsible,
    source,
    period,
    periodTimeIntervalId,
    delay,
    delayTimeIntervalId,
    observation = null,
  }: ICreateMaintenanceHistory) {
    return prisma.maintenanceHistory.create({
      data: {
        maintenanceId,
        element,
        activity,
        frequency,
        frequencyTimeIntervalId,
        period,
        periodTimeIntervalId,
        delay,
        delayTimeIntervalId,
        responsible,
        source,
        observation,
      },
    });
  }

  async editMaintenance({ maintenanceId, element }: IEditMaintenance) {
    const maintenance = await this.findById({ maintenanceId });
    validator.needExist([{ label: 'ID da manutenção', variable: maintenance }]);

    return prisma.maintenance.update({
      data: { element },
      where: { id: maintenanceId },
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
    validator.needExist([{ label: 'ID da manutenção', variable: maintenance }]);

    await prisma.maintenance.delete({
      where: { id: maintenanceId },
    });
  }
}
