import { prisma } from '../../../../../utils/prismaClient';

// CLASS
import { SharedCategoryServices } from '../../../../shared/categories/category/services/sharedCategoryServices';

const sharedCategoryServices = new SharedCategoryServices();

export class CategoryServices {
  async delete({ categoryId }: { categoryId: string }) {
    await sharedCategoryServices.findById({ categoryId });

    await prisma.category.delete({
      where: { id: categoryId },
    });
  } // criar logica de nao excluir caso alguem use

  async list({ search }: { search: string }) {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        Maintenances: true,
      },
      where: {
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
