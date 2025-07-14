import { prisma } from '../../../../../prisma';

export async function listBuildingTypes() {
  return prisma.buildingType.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}
