import { prisma } from '../../../../../../prisma';

import type { IListUser } from './types';

export class UserServices {
  async list({ take = 20, page, search = '' }: IListUser) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            phoneNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },

      orderBy: {
        name: 'asc',
      },

      take,
      skip: (page - 1) * take,
    });

    const usersCount = await prisma.user.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return { users, usersCount };
  }
}

export const userServices = new UserServices();
