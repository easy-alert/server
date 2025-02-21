import { prisma } from '../../../../../prisma';

interface IFindUserById {
  userId: string;
}

export async function findUserById({ userId }: IFindUserById) {
  return prisma.user.findFirst({
    include: {
      Companies: true,

      Permissions: {
        include: {
          Permission: {
            select: {
              name: true,
            },
          },
        },
      },

      UserBuildingsPermissions: true,
    },
    where: {
      id: userId,
    },
  });
}
