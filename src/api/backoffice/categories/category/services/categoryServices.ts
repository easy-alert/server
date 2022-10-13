import { prisma } from '../../../../../utils/prismaClient';
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

export class CategoryServices {
  async create({ name }: { name: string }) {
    return prisma.category.create({
      data: {
        name,
      },
    });
  }

  async edit({ name, categoryId }: { name: string; categoryId: string }) {
    await this.findById({ categoryId });

    return prisma.category.update({
      data: { name },
      where: { id: categoryId },
    });
  }

  async findById({ categoryId }: { categoryId: string }) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    validator.needExist([{ label: 'categoria', variable: category }]);

    return category;
  }

  async delete({ categoryId }: { categoryId: string }) {
    await this.findById({ categoryId });

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
            MaintenancesHistory: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
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
