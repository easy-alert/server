import { prisma, prismaTypes } from '../../../../../prisma';
import { setToUTCLastMinuteOfDay, setToUTCMidnight } from '../../../../utils/dateTime';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

class ChecklistServices {
  async create(args: prismaTypes.ChecklistCreateArgs) {
    return prisma.checklist.create(args);
  }

  async createMany(args: prismaTypes.ChecklistCreateManyArgs) {
    await prisma.checklist.createMany(args);
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

  async checkAccess({ buildingNanoId }: { buildingNanoId: string }) {
    const company = await prisma.company.findFirst({
      select: {
        canAccessChecklists: true,
      },
      where: { Buildings: { some: { nanoId: buildingNanoId } } },
    });

    validator.needExist([{ label: 'Edificação', variable: company }]);

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
