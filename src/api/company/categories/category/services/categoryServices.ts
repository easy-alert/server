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
                unitTime: true,
              },
            },
            DelayTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
                unitTime: true,
              },
            },
            PeriodTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
                unitTime: true,
              },
            },
            MaintenancesHistory: {
              select: {
                id: true,
              },
            },

            instructions: { select: { url: true, name: true } },
          },
          orderBy: {
            element: 'asc',
          },

          where: {
            OR: [
              {
                ownerCompanyId,
              },
              {
                ownerCompanyId: null,
              },
            ],
          },
        },
      },
      where: {
        NOT: {
          CategoryType: {
            name: 'occasional',
          },
        },

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
                unitTime: true,
              },
            },
            DelayTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
                unitTime: true,
              },
            },
            PeriodTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
                unitTime: true,
              },
            },

            instructions: { select: { url: true, name: true } },
          },
          orderBy: {
            element: 'asc',
          },
        },
      },
      where: {
        NOT: {
          CategoryType: {
            name: 'occasional',
          },
        },

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

    // ordena alfabeticamente
    categories.sort((a, b) => a.name.localeCompare(b.name));

    return categories;
  }

  async listByCompanyId(companyId: string) {
    const [defaultCategories, companyCategories] = await prisma.$transaction([
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          ownerCompanyId: null,

          NOT: {
            CategoryType: {
              name: 'occasional',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),

      prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          ownerCompanyId: companyId,

          NOT: {
            CategoryType: {
              name: 'occasional',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    return { defaultCategories, companyCategories };
  }
}
