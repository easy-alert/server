import { prisma } from '../../../../../../prisma';
import { SharedCategoryServices } from '../../../../shared/categories/services/sharedCategoryServices';

// CLASS

const sharedCategoryServices = new SharedCategoryServices();

export class CategoryServices {
  async delete({ categoryId }: { categoryId: string }) {
    await sharedCategoryServices.findById({ categoryId });

    await prisma.category.delete({
      where: { id: categoryId },
    });
  } // criar logica de nao excluir caso alguem use

  async list({ search, ownerCompanyId }: { search: string; ownerCompanyId: string }) {
    const defaultCategories = await prisma.category.findMany({
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
            MaintenancesHistory: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            element: 'asc',
          },
        },
      },
      where: {
        AND: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
          ownerCompanyId: null,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const companyCategories = await prisma.category.findMany({
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
          orderBy: {
            element: 'asc',
          },
        },
      },
      where: {
        AND: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
          ownerCompanyId,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const categories = [...defaultCategories, ...companyCategories];

    categories.sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));

    return categories;
  }
}
