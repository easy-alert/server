import type { Permission } from '@prisma/client';
import { prisma } from '../../../../../../prisma';

interface IUserBuildingsPermissions {
  buildingId: string;
  Permission?: Permission;
}

interface IUpdateUserBuildingsPermissionsById {
  userId: string;
  userBuildingsPermissions: IUserBuildingsPermissions[];
}

export async function updateUserBuildingsPermissionsById({
  userId,
  userBuildingsPermissions,
}: IUpdateUserBuildingsPermissionsById) {
  await prisma.userBuildingsPermissions.deleteMany({
    where: {
      userId,
    },
  });

  await prisma.userBuildingsPermissions.createMany({
    data: userBuildingsPermissions.map((userBuildingPermission) => ({
      userId,
      buildingId: userBuildingPermission.buildingId,
    })),
  });
}
