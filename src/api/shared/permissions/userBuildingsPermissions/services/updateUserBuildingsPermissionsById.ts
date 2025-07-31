import type { Permission } from '@prisma/client';
import { prisma, type prismaTypes } from '../../../../../../prisma';

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
  const newUserBuildingsPermissions: prismaTypes.UserBuildingsPermissionsCreateManyArgs['data'] =
    [];

  userBuildingsPermissions.forEach(async (userBuildingPermission) => {
    const selectedUserBuildingPermission = await prisma.userBuildingsPermissions.findUnique({
      where: {
        userId_buildingId: {
          userId,
          buildingId: userBuildingPermission.buildingId,
        },
      },
    });

    if (selectedUserBuildingPermission) {
      newUserBuildingsPermissions.push({
        userId,
        buildingId: selectedUserBuildingPermission.buildingId,
        permissionId: selectedUserBuildingPermission.permissionId,
        isMainContact: selectedUserBuildingPermission.isMainContact,
        showContact: selectedUserBuildingPermission.showContact,
      });
    } else {
      newUserBuildingsPermissions.push({
        userId,
        buildingId: userBuildingPermission.buildingId,
        permissionId: userBuildingPermission.Permission?.id,
      });
    }
  });

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
    data: newUserBuildingsPermissions,
  });
}
