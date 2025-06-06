import type { ChecklistStatusName } from '@prisma/client';

import { prisma, prismaTypes } from '../../../../../prisma';

import { setToLastMinuteOfDay, setToMidnight } from '../../../../utils/dateTime';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

interface IFindManyForReport {
  buildingId: string[] | undefined;
  statusNames?: ChecklistStatusName[];
  companyId: string | undefined;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  take?: number;
}

class ChecklistServices {
  async create(args: prismaTypes.ChecklistCreateArgs) {
    return prisma.checklist.create(args);
  }

  async update(args: prismaTypes.ChecklistUpdateArgs) {
    return prisma.checklist.update(args);
  }

  async updateMany(args: prismaTypes.ChecklistUpdateManyArgs) {
    return prisma.checklist.updateMany(args);
  }

  async findById(id: string) {
    const checklist = await prisma.checklist.findUnique({
      include: {
        images: true,
        detailImages: true,

        building: {
          select: {
            nanoId: true,
            id: true,
            name: true,
            Company: {
              select: {
                canAccessChecklists: true,
              },
            },
          },
        },

        frequencyTimeInterval: {
          select: {
            id: true,
            unitTime: true,
          },
        },
      },

      where: { id },
    });

    validator.needExist([{ label: 'Checklist', variable: checklist }]);

    return checklist!;
  }

  async deleteMany(args: prismaTypes.ChecklistDeleteManyArgs) {
    await prisma.checklist.deleteMany(args);
  }

  async findMany({
    buildingNanoId,
    userId,
    date,
  }: {
    buildingNanoId: string;
    userId?: string;
    date: string;
  }) {
    return prisma.checklist.findMany({
      select: {
        id: true,
        buildingId: true,
        name: true,
        status: true,

        checklistItem: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },

        checklistUsers: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },

      where: {
        building: {
          nanoId: buildingNanoId,
        },

        checklistUsers: {
          some: {
            userId,
          },
        },

        date: {
          gte: setToMidnight(new Date(date)),
          lte: setToLastMinuteOfDay(new Date(date)),
        },
      },

      orderBy: [{ status: 'asc' }, { name: 'asc' }],
    });
  }

  async findManyForReport({
    buildingId,
    companyId,
    statusNames,
    startDate,
    endDate,
  }: IFindManyForReport) {
    return prisma.checklist.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        date: true,

        building: {
          select: {
            name: true,
          },
        },

        frequency: true,
        status: true,
        observation: true,
        images: {
          select: {
            name: true,
            url: true,
          },
        },

        detailImages: {
          select: {
            name: true,
            url: true,
          },
        },

        checklistItem: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },

      where: {
        building: {
          id: {
            in: buildingId,
          },

          Company: {
            id: companyId,
          },
        },

        status: {
          in: statusNames,
        },

        date: {
          gte: startDate,
          lte: endDate,
        },
      },

      orderBy: {
        date: 'desc',
      },
    });
  }

  async checkAccess({ buildingNanoId }: { buildingNanoId: string }) {
    const company = await prisma.company.findFirst({
      select: {
        canAccessChecklists: true,
      },
      where: { Buildings: { some: { nanoId: buildingNanoId } } },
    });

    validator.needExist([{ label: 'Empresa', variable: company }]);

    if (!company?.canAccessChecklists) {
      throw new ServerMessage({
        statusCode: 403,
        message: `Sua empresa não possui acesso a este módulo.`,
      });
    }
  }

  async checkAccessByCompany({ companyId }: { companyId: string }) {
    const company = await prisma.company.findFirst({
      select: {
        canAccessChecklists: true,
      },
      where: {
        id: companyId,
      },
    });

    validator.needExist([{ label: 'Empresa', variable: company }]);

    if (!company?.canAccessChecklists) {
      throw new ServerMessage({
        statusCode: 403,
        message: `Sua empresa não possui acesso a este módulo.`,
      });
    }
  }

  async findChecklistDataByMonth({
    userId,
    buildingNanoId,
  }: {
    userId?: string;
    buildingNanoId: string;
  }) {
    const [pending, inProgress, completed] = await prisma.$transaction([
      prisma.checklist.findMany({
        select: { date: true },
        distinct: 'date',
        where: {
          building: { nanoId: buildingNanoId },
          checklistUsers: {
            some: {
              userId,
            },
          },
          status: 'pending',
        },
      }),

      prisma.checklist.findMany({
        select: { date: true },
        distinct: 'date',
        where: {
          building: { nanoId: buildingNanoId },
          checklistUsers: {
            some: {
              userId,
            },
          },
          status: 'inProgress',
        },
      }),

      prisma.checklist.findMany({
        select: { date: true },
        distinct: 'date',
        where: {
          building: { nanoId: buildingNanoId },
          checklistUsers: {
            some: {
              userId,
            },
          },
          status: 'completed',
        },
      }),
    ]);

    return { pending, inProgress, completed };
  }

  async findLatestChecklistFromGroup({ groupId }: { groupId: string }) {
    const checklist = await prisma.checklist.findFirst({
      include: {
        frequencyTimeInterval: {
          select: {
            unitTime: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      where: {
        groupId,
      },
    });

    validator.needExist([{ label: 'Checklist', variable: checklist }]);

    return checklist!;
  }

  async checkChecklistAccess({ checklistId }: { checklistId: string }): Promise<void> {
    const checklist = await prisma.checklist.findUnique({
      select: {
        building: {
          select: {
            Company: {
              select: {
                canAccessChecklists: true,
              },
            },
          },
        },
      },
      where: { id: checklistId },
    });

    validator.needExist([{ label: 'Checklist', variable: checklist }]);

    if (!checklist?.building.Company.canAccessChecklists) {
      throw new ServerMessage({
        statusCode: 403,
        message: `Sua empresa não possui acesso a este módulo.`,
      });
    }
  }
}

export const checklistServices = new ChecklistServices();
