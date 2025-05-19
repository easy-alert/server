import type { Permission } from '@prisma/client';
import { prisma } from '../../../../../../prisma';

interface IUserBuildingsPermissions {
  buildingId: string;
  Permission?: Permission;
}

interface IUpdateUserBuildingsPermissionsById {
  companyId: string;
  userId: string;
  userBuildingsPermissions: IUserBuildingsPermissions[];
}

export async function updateUserBuildingsPermissionsById({
  companyId,
  userId,
  userBuildingsPermissions,
}: IUpdateUserBuildingsPermissionsById) {
  await prisma.userBuildingsPermissions.deleteMany({
    where: {
      userId,

      Building: {
        Company: {
          id: companyId,
        },
      },
    },
  });

  await prisma.userBuildingsPermissions.createMany({
    data: userBuildingsPermissions.map((userBuildingPermission) => ({
      userId,
      buildingId: userBuildingPermission.buildingId,
    })),
  });
}
