import { prisma } from '../../../../../../prisma';
import { ICreateMaintenance, IEditMaintenance, IMaintenanceHistory } from './types';

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

  async createHistory({ data }: { data: IMaintenanceHistory[] }) {
    await prisma.maintenanceHistory.createMany({
      data,
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

    return maintenance!;
  }

  async findMaintenancesPerPeriod({ companyId }: { companyId: string }) {
    return prisma.building.findMany({
      select: {
        name: true,
        deliveryDate: true,
        Categories: {
          select: {
            Maintenances: {
              select: {
                Maintenance: {
                  select: {
                    id: true,
                    element: true,
                    // frequency: true,
                    // delay: true,
                    // activity: true,
                    // observation: true,
                    // delayTimeIntervalId: true,
                    // period: true,
                    // responsible: true,
                    // source: true,

                    PeriodTimeInterval: {
                      select: {
                        name: true,
                        unitTime: true,
                      },
                    },
                    DelayTimeInterval: {
                      select: {
                        name: true,
                        unitTime: true,
                      },
                    },
                    FrequencyTimeInterval: {
                      select: {
                        name: true,
                        unitTime: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      where: {
        companyId,
      },
    });
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
