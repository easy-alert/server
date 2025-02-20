import { prisma } from '../../../../../prisma';

interface IListMaintenanceCategoriesForSelect {
  companyId: string;
}

export async function listMaintenanceCategoriesForSelect({
  companyId,
}: IListMaintenanceCategoriesForSelect) {
  const companyCategories = await prisma.category.findMany({
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
  });

  const defaultCategories = await prisma.category.findMany({
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
  });

  const categories = [...defaultCategories, ...companyCategories];

  // ordena alfabeticamente
  categories.sort((a, b) => a.name.localeCompare(b.name));

  return categories;

  // return prisma.category.findMany({
  //   where: {
  //     ownerCompanyId: null,
  //   },

  //   orderBy: {
  //     name: 'asc',
  //   },
  // });
}
