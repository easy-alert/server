import { prisma } from '../../../../../../prisma';

export async function findUserById(userId: string) {
  return prisma.user.findUnique({
    include: {
      Companies: {
        select: {
          Company: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },

    where: { id: userId },
  });
}
