import { prisma } from '../../../../../../prisma';

interface IGetUserPermissionsById {
  companyId?: string;
  userId?: string;
}

export async function getUserPermissionsById({ companyId, userId }: IGetUserPermissionsById) {
  const userPermissions = await prisma.userPermissions.findMany({
    select: {
      Permission: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    where: {
      companyId,
      userId,
    },
  });

  return userPermissions;
}
