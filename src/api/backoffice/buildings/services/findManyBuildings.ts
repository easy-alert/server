import { prisma } from '../../../../../prisma';

interface IFindManyBuildings {
  take?: number;
  page: number;
  search?: string;
}

export async function findManyBuildings({ take = 20, page, search }: IFindManyBuildings) {
  const buildings = await prisma.building.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      city: true,
      streetName: true,
      createdAt: true,
      isBlocked: true,
    },

    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },

    orderBy: {
      createdAt: 'asc',
    },

    take,
    skip: (page - 1) * take,
  });

  const totalBuildings = await prisma.building.count({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
  });

  return {
    buildings,
    totalBuildings,
  };
}
