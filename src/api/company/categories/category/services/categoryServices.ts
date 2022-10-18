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

  async list({
    search,
    ownerCompanyId,
  }: {
    search: string;
    ownerCompanyId: string;
  }) {
    return prisma.category.findMany({
      select: {
        id: true,
        ownerCompanyId: true,
        name: true,

        Maintenances: {
          select: {
            id: true,
            element: true,
            activity: true,
            frequency: true,
            delay: true,
            period: true,
            responsible: true,
            source: true,
            observation: true,
            ownerCompanyId: true,

            FrequencyTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
              },
            },
            DelayTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
              },
            },
            PeriodTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
              },
            },
          },
          where: {
            ownerCompanyId,
          },
        },
      },
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        ownerCompanyId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
