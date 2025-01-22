import { prisma } from '../../../../../../prisma';

interface IUserPermissions {
  id: string;
  name: string;
}

interface IUpdateUserPermissionsById {
  userId: string;
  userPermissions: IUserPermissions[];
}

export async function updateUserPermissionsById({
  userId,
  userPermissions,
}: IUpdateUserPermissionsById) {
  await prisma.userPermissions.deleteMany({
    where: {
      userId,
    },
  });

  await prisma.userPermissions.createMany({
    data: userPermissions.map((userPermission) => ({
      userId,
      permissionId: userPermission.id,
    })),
  });
}
