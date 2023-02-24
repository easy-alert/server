import { prisma } from '../../../../../prisma';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';
import {
  IChangeMaintenanceHistoryStatus,
  ICreateMaintenance,
  IEditMaintenance,
  IMaintenanceHistory,
} from './types';

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

  async changeMaintenanceHistoryStatus({
    maintenanceHistoryId,
    maintenanceStatusId,
    resolutionDate,
  }: IChangeMaintenanceHistoryStatus) {
    return prisma.maintenanceHistory.update({
      data: {
        maintenanceStatusId,
        resolutionDate,
      },
      where: {
        id: maintenanceHistoryId,
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

    return maintenance!;
  }

  async findHistoryById({ maintenanceHistoryId }: { maintenanceHistoryId: string }) {
    const maintenance = await prisma.maintenanceHistory.findUnique({
      select: {
        notificationDate: true,
        dueDate: true,
        MaintenanceReport: {
          select: {
            id: true,
            cost: true,
          },
        },
        Building: {
          select: {
            id: true,
            name: true,
            warrantyExpiration: true,
            keepNotificationAfterWarrantyEnds: true,
          },
        },
        Company: {
          select: {
            id: true,
          },
        },
        Maintenance: {
          select: {
            id: true,
            frequency: true,
            activity: true,
            observation: true,

            Category: {
              select: {
                name: true,
              },
            },
            FrequencyTimeInterval: {
              select: {
                unitTime: true,
              },
            },

            period: true,
            PeriodTimeInterval: {
              select: {
                unitTime: true,
              },
            },
          },
        },
      },
      where: { id: maintenanceHistoryId },
    });

    validator.needExist([{ label: 'ID do histórico da manutenção', variable: maintenance }]);

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

  async checkMaintenanceIsUsed({ maintenanceId }: { maintenanceId: string }) {
    const maintenance = await prisma.buildingMaintenance.findFirst({
      where: {
        maintenanceId,
      },
    });

    if (maintenance) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Você não pode excluir uma manutenção em uso.',
      });
    }
  }

  async delete({ maintenanceId }: { maintenanceId: string }) {
    await this.findById({ maintenanceId });

    await prisma.maintenance.delete({
      where: { id: maintenanceId },
    });
  }
}
