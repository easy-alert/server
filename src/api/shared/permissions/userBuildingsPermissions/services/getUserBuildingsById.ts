import { prisma } from '../../../../../../prisma';

export async function getUserBuildingsById({ buildingId }: { buildingId: string }) {
  const userBuildings = await prisma.userBuildingsPermissions.findMany({
    select: {
      User: true,
    },

    where: {
      buildingId,
    },
  });

  return userBuildings;
}
