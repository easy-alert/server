import { prisma } from '../../../../../prisma';

interface IFindBuildingById {
  buildingId: string;
}

export async function findBuildingById({ buildingId }: IFindBuildingById) {
  const building = await prisma.building.findUnique({
    include: {
      UserBuildingsPermissions: {
        include: {
          User: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
        },
      },
    },

    where: {
      id: buildingId,
    },
  });

  return building;
}
