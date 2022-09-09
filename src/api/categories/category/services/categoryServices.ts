import { prisma } from '../../../../utils/prismaClient';

export class CategoryServices {
  async create({ name }: { name: string }) {
    return prisma.category.create({
      data: {
        name,
      },
    });
  }

  async edit({ name, categoryId }: { name: string; categoryId: string }) {
    return prisma.category.update({
      data: { name },
      where: { id: categoryId },
    });
  }

  async delete({ categoryId }: { categoryId: string }) {
    await prisma.category.delete({
      where: { id: categoryId },
    });
  }
}
