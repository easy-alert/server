// PRISMA
import { prisma } from '../../../utils/prismaClient';

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
    return prisma.timeInterval.findUnique({
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
  }
}
