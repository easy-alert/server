import { prisma } from '../../../../../../prisma';

export async function getUserBuildingsPermissionsById({ userId }: { userId?: string }) {
  const userBuildingsPermissions = await prisma.userBuildingsPermissions.findMany({
    select: {
      buildingId: true,
      Permission: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    where: {
      userId,
    },
  });

  return userBuildingsPermissions;
}
