import { Prisma } from '@prisma/client';

import { prisma } from '../../../../../../prisma';

interface IUpdateUser {
  userId: string;
  data: Prisma.UserUpdateInput;
}

export async function updateUser({ userId, data }: IUpdateUser) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return updatedUser;
}
