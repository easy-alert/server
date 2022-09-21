// PRISMA
import { prisma } from '../../../utils/prismaClient';

export class TimeIntervalServices {
  async list() {
    return prisma.timeInterval.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findByName({ name }: { name: string }) {
    return prisma.timeInterval.findUnique({
      where: { name },
    });
  }
}
