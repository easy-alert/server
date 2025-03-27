import { prisma } from '../../../../../../prisma';

import { needExist } from '../../../../../utils/newValidator';

import type { IFindUserById, IListUser } from './types';

export class UserServices {
  async findById({ userId }: IFindUserById) {
    const user = await prisma.user.findUnique({
      include: {
        Companies: {
          include: {
            Company: true,
          },
        },
      },

      where: {
        id: userId,
      },
    });

    needExist([{ label: 'Usuário', variable: user }]);

    return user;
  }

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
    });

    return { users, usersCount };
  }
}

export const userServices = new UserServices();
