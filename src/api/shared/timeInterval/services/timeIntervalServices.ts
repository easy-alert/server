// PRISMA
import { prisma } from '../../../../../prisma';

// CLASS
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export class TimeIntervalServices {
  async list() {
    return prisma.timeInterval.findMany({
      select: {
        id: true,
        name: true,
        pluralLabel: true,
        singularLabel: true,
        unitTime: true,
      },
      orderBy: {
        unitTime: 'asc',
      },
    });
  }

  async findByName({ name }: { name: string }) {
    const timeInterval = await prisma.timeInterval.findUnique({
      select: {
        id: true,
        name: true,
        pluralLabel: true,
        singularLabel: true,
        unitTime: true,
      },
      where: { name },
    });

    validator.needExist([{ label: 'Unidade de tempo', variable: timeInterval }]);

    return timeInterval!;
  }

  async findById({ timeIntervalId }: { timeIntervalId: string }) {
    const timeInterval = await prisma.timeInterval.findUnique({
      select: {
        id: true,
        name: true,
        singularLabel: true,
        pluralLabel: true,
        unitTime: true,
      },
      where: {
        id: timeIntervalId,
      },
    });

    validator.notNull([{ label: 'ID da unidade', variable: timeInterval }]);

    return timeInterval!;
  }
}
