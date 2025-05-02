import { Prisma } from '@prisma/client';
import { prisma, prismaTypes } from '../../../../../prisma';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';
import {
  IChangeMaintenanceHistoryStatus,
  ICreateMaintenance,
  ICreateMaintenanceHistoryAndReport,
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
    maintenanceTypeId,
    instructions,
    priorityName,
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
        maintenanceTypeId,
        priorityName,
        instructions: { createMany: { data: instructions } },
      },
    });
  }

  async createHistory({ data }: { data: IMaintenanceHistory[] }) {
    return prisma.maintenanceHistory.createMany({
      data,
    });
  }

  async createOneHistory(args: prismaTypes.MaintenanceHistoryCreateArgs) {
    return prisma.maintenanceHistory.create(args);
  }

  async createMaintenanceHistoryUser({
    data,
  }: {
    data: { maintenanceHistoryId: string; userId: string };
  }) {
    return prisma.maintenanceHistoryUsers.create({
      data,
    });
  }

  async createHistoryAndReport({ data }: { data: ICreateMaintenanceHistoryAndReport }) {
    return prisma.maintenanceHistory.create({
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
        // Forçando ficar falso quando tá concluída
        inProgress: false,
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
    instructions,
    priorityName,
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
        priorityName,
        instructions: {
          deleteMany: {},
          createMany: { data: instructions || [] },
        },
      },
      where: {
        id: maintenanceId,
      },
    });
  }

  async updateMaintenanceHistory({
    maintenanceHistoryId,
    data,
  }: {
    maintenanceHistoryId: string;
    data: Prisma.MaintenanceHistoryUncheckedUpdateInput;
  }) {
    await this.findHistoryById({ maintenanceHistoryId });

    return prisma.maintenanceHistory.update({
      data,
      where: {
        id: maintenanceHistoryId,
      },
    });
  }

  async updateMaintenanceHistoryToInProgress(maintenanceHistoryId: string) {
    const { MaintenancesStatus } = await this.findHistoryById({ maintenanceHistoryId });

    if (MaintenancesStatus.name === 'completed' || MaintenancesStatus.name === 'overdue') {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Essa manutenção já foi finalizada.',
      });
    }

    return prisma.maintenanceHistory.update({
      data: { inProgress: true },
      where: {
        id: maintenanceHistoryId,
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

  async findOccasionalByName({ maintenanceName }: { maintenanceName: string }) {
    return prisma.maintenance.findFirst({
      where: {
        element: maintenanceName,

        MaintenanceType: {
          name: 'occasional',
        },
      },
    });
  }

  async findHistoryById({ maintenanceHistoryId }: { maintenanceHistoryId: string }) {
    const maintenance = await prisma.maintenanceHistory.findUnique({
      select: {
        id: true,
        notificationDate: true,
        dueDate: true,
        resolutionDate: true,
        MaintenancesStatus: {
          select: {
            name: true,
          },
        },
        MaintenanceReport: {
          select: {
            id: true,
            cost: true,
            observation: true,
          },
        },
        Building: {
          select: {
            id: true,
            name: true,
            warrantyExpiration: true,
            keepNotificationAfterWarrantyEnds: true,
            mandatoryReportProof: true,
          },
        },
        Company: {
          select: {
            id: true,
            name: true,
            UserCompanies: {
              select: {
                User: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        },
        Maintenance: {
          select: {
            id: true,
            frequency: true,
            activity: true,
            observation: true,
            element: true,
            responsible: true,
            source: true,

            MaintenanceType: {
              select: {
                name: true,
              },
            },

            Category: {
              select: {
                id: true,
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

  async findHistoryByCategoryId({ categoryId }: { categoryId: string }) {
    return prisma.maintenanceHistory.findMany({
      select: {
        id: true,
        notificationDate: true,
      },
      where: {
        Maintenance: {
          categoryId,
        },
      },
    });
  }

  //  esse parece estar com nome errado é bem semelhante ao findById ali de cima
  async findHistoryByNanoId({ maintenanceHistoryId }: { maintenanceHistoryId: string }) {
    const maintenance = await prisma.maintenanceHistory.findUnique({
      select: {
        id: true,
        maintenanceId: true,
        notificationDate: true,
        dueDate: true,
        daysInAdvance: true,
        MaintenancesStatus: {
          select: {
            name: true,
          },
        },
        MaintenanceReport: {
          select: {
            id: true,
            cost: true,
            observation: true,
          },
        },
        Building: {
          select: {
            id: true,
            name: true,
            warrantyExpiration: true,
            keepNotificationAfterWarrantyEnds: true,
            nextMaintenanceCreationBasis: true,
          },
        },
        Company: {
          select: {
            id: true,
            name: true,
            image: true,
            UserCompanies: {
              select: {
                User: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        },
        Maintenance: {
          select: {
            id: true,
            frequency: true,
            activity: true,
            observation: true,
            element: true,
            responsible: true,
            source: true,

            MaintenanceType: {
              select: {
                name: true,
              },
            },

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

        tickets: {
          select: {
            id: true,
          },
          // Trazendo só os que ainda não foram realizados, pois se tirar isso ele vai notificar até os que já foi utilizada essa manutenção antes
          where: {
            statusName: 'awaitingToFinish',
          },
        },
      },
      where: { id: maintenanceHistoryId },
    });

    validator.needExist([{ label: 'ID do histórico da manutenção', variable: maintenance }]);

    return maintenance!;
  }

  async findManyHistory({ buildingId }: { buildingId: string }) {
    const maintenances = await prisma.maintenanceHistory.groupBy({
      by: ['maintenanceId'],

      where: {
        buildingId,
        MaintenancesStatus: {
          name: 'pending',
        },
      },
    });

    return maintenances;
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

  async findHistoryByBuildingId({
    buildingId,
    maintenanceId,
  }: {
    buildingId: string;
    maintenanceId: string;
  }) {
    return prisma.maintenanceHistory.findMany({
      select: {
        id: true,
        notificationDate: true,
        maintenanceId: true,
        wasNotified: true,
        priority: true,
        showToResident: true,
        Maintenance: {
          select: {
            period: true,
            PeriodTimeInterval: true,
          },
        },

        MaintenancesStatus: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },

      take: 3,

      where: {
        buildingId,
        maintenanceId,
      },
    });
  }

  async countPerCompanyId({ companyId }: { companyId: string }) {
    const [maintenancesCount, defaultMaintenances] = await prisma.$transaction([
      prisma.maintenance.count({
        where: {
          ownerCompanyId: companyId,

          NOT: {
            MaintenanceType: {
              name: 'occasional',
            },
          },
        },
      }),

      prisma.maintenance.count({
        where: {
          ownerCompanyId: null,

          NOT: {
            MaintenanceType: {
              name: 'occasional',
            },
          },
        },
      }),
    ]);

    return maintenancesCount + defaultMaintenances;
  }

  async checkMaintenanceIsUsed({ maintenanceId }: { maintenanceId: string }) {
    const maintenance = await prisma.maintenanceHistory.findFirst({
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

  async deleteHistory({ maintenanceHistoryId }: { maintenanceHistoryId: string }) {
    await this.findHistoryById({ maintenanceHistoryId });

    await prisma.maintenanceHistory.delete({
      where: { id: maintenanceHistoryId },
    });
  }
}
