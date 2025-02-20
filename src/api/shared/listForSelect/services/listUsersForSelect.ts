import { prisma } from '../../../../../prisma';

interface IListUsersForSelect {
  companyId: string;
  buildingId?: string;
}

export async function listUsersForSelect({ companyId, buildingId }: IListUsersForSelect) {
  let building;

  if (buildingId && buildingId?.length === 12) {
    building = await prisma.building.findUnique({
      where: {
        nanoId: buildingId,
      },
    });
  } else if (buildingId) {
    building = await prisma.building.findUnique({
      where: {
        id: buildingId,
      },
    });
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
            id: building?.id || undefined,

            Company: {
              id: companyId,
            },
          },
        },
      },
    },
  });
}
