import { ChecklistStatusName } from '@prisma/client';
import { prisma, prismaTypes } from '../../../../../prisma';
import { setToUTCLastMinuteOfDay, setToUTCMidnight } from '../../../../utils/dateTime';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

interface IFindManyForReport {
  companyId: string;
  buildingNames?: string[];
  statusNames?: ChecklistStatusName[];
  startDate: Date;
  endDate: Date;
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
        syndic: {
          select: {
            id: true,
            name: true,
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

  async findMany({ buildingNanoId, date }: { buildingNanoId: string; date: string }) {
    return prisma.checklist.findMany({
      select: {
        id: true,
        buildingId: true,
        name: true,
        syndic: {
          select: {
            name: true,
          },
        },
        status: true,
      },
      where: {
        building: {
          nanoId: buildingNanoId,
        },

        date: {
          gte: setToUTCMidnight(new Date(date)),
          lte: setToUTCLastMinuteOfDay(new Date(date)),
        },
      },

      orderBy: [{ status: 'asc' }, { name: 'asc' }],
    });
  }

  async findManyForReport({
    companyId,
    endDate,
    startDate,
    buildingNames,
    statusNames,
  }: IFindManyForReport) {
    const where: prismaTypes.ChecklistWhereInput = {
      building: {
        companyId,
        name: buildingNames?.length ? { in: buildingNames } : undefined,
      },

      date: {
        gte: startDate,
        lte: endDate,
      },

      status: statusNames?.length ? { in: statusNames } : undefined,
    };

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
        syndic: {
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
      },
      where,

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

  async findChecklistDataByMonth({ buildingNanoId }: { buildingNanoId: string }) {
    const [pending, completed] = await prisma.$transaction([
      prisma.checklist.findMany({
        select: { date: true },
        distinct: 'date',
        where: { building: { nanoId: buildingNanoId }, status: 'pending' },
      }),
      prisma.checklist.findMany({
        select: { date: true },
        distinct: 'date',
        where: { building: { nanoId: buildingNanoId }, status: 'completed' },
      }),
    ]);

    return { pending, completed };
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
}

export const checklistServices = new ChecklistServices();
