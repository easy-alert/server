// PRISMA
import { prisma } from '../../../../utils/prismaClient';

// CLASS
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export class TimeIntervalServices {
  async list() {
    return prisma.timeInterval.findMany({
      orderBy: {
        unitTime: 'asc',
      },
    });
  }

  async findByName({ name }: { name: string }) {
    return prisma.timeInterval.findUnique({
      select: {
        id: true,
        name: true,
        pluralLabel: true,
        singularLabel: true,
        unitTime: true,
      },
      where: { name },
    });
  }

  async findById({ timeIntervalId }: { timeIntervalId: string }) {
    const timeInterval = await prisma.timeInterval.findUnique({
      select: {
        id: true,
        name: true,
        singularLabel: true,
        pluralLabel: true,
      },
      where: {
        id: timeIntervalId,
      },
    });

    validator.notNull([
      { label: 'ID do tempo de intervalo', variable: timeInterval },
    ]);

    return timeInterval;
  }
}
