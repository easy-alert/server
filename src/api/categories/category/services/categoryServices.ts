import { prisma } from '../../../../utils/prismaClient';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export class CategoryServices {
  async create({ name }: { name: string }) {
    return prisma.category.create({
      data: {
        name,
      },
    });
  }

  async findById({ categoryId }: { categoryId: string }) {
    return prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  }

  async edit({ name, categoryId }: { name: string; categoryId: string }) {
    const category = await this.findById({ categoryId });
    validator.needExist([{ label: 'ID da categoria', variable: category }]);

    return prisma.category.update({
      data: { name },
      where: { id: categoryId },
    });
  }

  async delete({ categoryId }: { categoryId: string }) {
    const category = await this.findById({ categoryId });
    validator.needExist([{ label: 'ID da categoria', variable: category }]);

    await prisma.category.delete({
      where: { id: categoryId },
    });
  }

  async list({ search }: { search: string }) {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        Maintenances: {
          select: {
            id: true,
            element: true,
            MaintenancesHistory: {
              select: {
                id: true,
                element: true,
                activity: true,
                frequency: true,
                FrequencyTimeInterval: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                responsible: true,
                source: true,
                period: true,
                PeriodTimeInterval: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                delay: true,
                DelayTimeInterval: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                observation: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
          orderBy: {
            element: 'asc',
          },
        },
      },
      where: {
        isDeleted: false,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
