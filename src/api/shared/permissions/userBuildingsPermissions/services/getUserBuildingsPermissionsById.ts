import { prisma } from '../../../../../../prisma';

interface IGetUserBuildingsPermissionsById {
  companyId?: string;
  userId?: string;
}

export async function getUserBuildingsPermissionsById({
  companyId,
  userId,
}: IGetUserBuildingsPermissionsById) {
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

      Building: {
        Company: {
          id: companyId,
        },
      },
    },
  });

  return userBuildingsPermissions;
}
