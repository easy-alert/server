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
    await prisma.checklist.update(args);
  }

  async findById(id: string) {
    const checklist = await prisma.checklist.findFirst({
      where: { id, building: { Company: { canAccessChecklists: true } } },
    });

    validator.needExist([{ label: 'Checklist', variable: checklist }]);

    return checklist!;
  }

  async delete(id: string) {
    await this.findById(id);

    return prisma.checklist.delete({ where: { id } });
  }

  async findMany({ buildingId, date }: { buildingId: string; date: string }) {
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
        buildingId,

        date: {
          gte: setToUTCMidnight(new Date(date)),
          lte: setToUTCLastMinuteOfDay(new Date(date)),
        },
      },

      orderBy: [{ status: 'asc' }, { name: 'asc' }],
    });
  }

  async checkAccess({ buildingId }: { buildingId: string }) {
    const company = await prisma.company.findFirst({
      select: {
        canAccessChecklists: true,
      },
      where: { Buildings: { some: { id: buildingId } } },
    });

    validator.needExist([{ label: 'Edificação', variable: company }]);

    if (!company?.canAccessChecklists) {
      throw new ServerMessage({
        statusCode: 403,
        message: `Sua empresa não possui acesso a este módulo.`,
      });
    }
  }
}

export const checklistServices = new ChecklistServices();
