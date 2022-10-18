import { prisma } from '../../../../../utils/prismaClient';
import { ICreateMaintenance, IEditMaintenance } from './types';

import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

export class SharedMaintenanceServices {
  // # region validation

  // #endregion

  async create({
    categoryId,
    ownerCompanyId,
    element,
    activity,
    frequency,
    frequencyTimeIntervalId,
    responsible,
    source,
    delay,
    periodTimeIntervalId,
    period,
    delayTimeIntervalId,
    observation,
  }: ICreateMaintenance) {
    return prisma.maintenance.create({
      data: {
        categoryId,
        ownerCompanyId,
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
        observation,
      },
    });
  }

  async edit({
    maintenanceId,
    element,
    activity,
    frequency,
    frequencyTimeIntervalId,
    responsible,
    source,
    delay,
    periodTimeIntervalId,
    period,
    delayTimeIntervalId,
    observation,
  }: IEditMaintenance) {
    await this.findById({ maintenanceId });

    return prisma.maintenance.update({
      data: {
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
        observation,
      },
      where: {
        id: maintenanceId,
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
