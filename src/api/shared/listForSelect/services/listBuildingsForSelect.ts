import { prisma } from '../../../../../prisma';

interface IListBuildingsForSelect {
  companyId: string;
  buildingsIds?: string[];
}

export async function listBuildingsForSelect({ companyId, buildingsIds }: IListBuildingsForSelect) {
  return prisma.building.findMany({
    select: {
      id: true,
      nanoId: true,
      name: true,
    },

    where: {
      companyId,

      isBlocked: false,

      AND: {
        id: {
          in: buildingsIds,
        },
      },
    },

    orderBy: {
      name: 'asc',
    },
  });
}
