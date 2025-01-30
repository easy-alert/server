import { prisma } from '../../../../../../prisma';

export async function getUserPermissionsById({ userId }: { userId?: string }) {
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
      userId,
    },
  });

  return userPermissions;
}
