import { prisma } from '../../../../../../prisma';

interface IUserPermissions {
  id: string;
  name: string;
}

interface IUpdateUserPermissionsById {
  companyId: string;
  userId: string;
  userPermissions: IUserPermissions[];
}

export async function updateUserPermissionsById({
  companyId,
  userId,
  userPermissions,
}: IUpdateUserPermissionsById) {
  await prisma.userPermissions.deleteMany({
    where: {
      companyId,
      userId,
    },
  });

  await prisma.userPermissions.createMany({
    data: userPermissions.map((userPermission) => ({
      companyId,
      userId,
      permissionId: userPermission.id,
    })),
  });
}
