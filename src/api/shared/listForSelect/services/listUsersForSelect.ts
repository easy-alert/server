import { prisma } from '../../../../../prisma';

interface IListUsersForSelect {
  companyId: string;
  buildingId?: string;
}

export async function listUsersForSelect({ companyId, buildingId }: IListUsersForSelect) {
  let building;

  if (buildingId?.length === 12) {
    building = await prisma.building.findUnique({
      where: {
        nanoId: buildingId,
      },
    });
  } else {
    building = await prisma.building.findUnique({
      where: {
        id: buildingId,
      },
    });
  }

  if (!building) {
    throw new Error('Edificação não encontrada.');
  }

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },

    where: {
      UserBuildingsPermissions: {
        some: {
          Building: {
            id: building.id,
            Company: {
              id: companyId,
            },
          },
        },
      },
    },
  });
}
