import { prisma } from '../../../../../../prisma';
import { ICreateMaintenance, IEditMaintenance } from './types';

import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

export class SharedMaintenanceServices {
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

    validator.needExist([{ label: 'ID da manutenção', variable: maintenance }]);

    return maintenance;
  }

  async countPerCompanyId({ companyId }: { companyId: string }) {
    const [maintenancesCount, defaultMaintenances] = await prisma.$transaction([
      prisma.maintenance.count({
        where: {
          ownerCompanyId: companyId,
        },
      }),

      prisma.maintenance.count({
        where: {
          ownerCompanyId: null,
        },
      }),
    ]);

    return maintenancesCount + defaultMaintenances;
  }

  async delete({ maintenanceId }: { maintenanceId: string }) {
    await this.findById({ maintenanceId });

    await prisma.maintenance.delete({
      where: { id: maintenanceId },
    });
  } // criar logica de nao excluir caso alguem use
}
