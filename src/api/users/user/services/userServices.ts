// PRISMA
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { prisma } from '../../../../utils/prismaClient';

// TYPES
import { IEditUser, IEditUserPassword, IListUser } from '../types';

export class UserServices {
  async create({ name, email, passwordHash }: Prisma.UserCreateInput) {
    return prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash: hashSync(passwordHash, 12),
      },
    });
  }

  async edit({ userId, name, email }: IEditUser) {
    await prisma.user.update({
      data: {
        name,
        email,
      },
      where: { id: userId },
    });
  }

  async updateLastAccess({ userId }: { userId: string }) {
    await prisma.user.update({
      data: {
        lastAccess: new Date(),
      },
      where: { id: userId },
    });
  }

  async editPassword({ userId, password }: IEditUserPassword) {
    await prisma.user.update({
      data: {
        passwordHash: hashSync(password, 12),
      },
      where: { id: userId },
    });
  }

  async changeIsBlocked({ userId }: { userId: string }) {
    const user = await this.findById({ userId });

    await prisma.user.update({
      data: {
        isBlocked: user!.isBlocked,
      },
      where: { id: userId },
    });
  }

  async delete({ userId }: { userId: string }) {
    await prisma.user.delete({ where: { id: userId } });
  }

  async findByEmail({ email }: { email: string }) {
    return prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        isBlocked: true,
        updatedAt: true,
        createdAt: true,
        UserPermissions: true,
      },

      where: { email: email.toLowerCase() },
    });
  }

  async findByEmailForEdit({
    email,
    userId,
  }: {
    email: string;
    userId: string;
  }) {
    return prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,

        isBlocked: true,

        updatedAt: true,
        createdAt: true,
      },
      where: {
        email: email.toLowerCase(),
        NOT: {
          id: userId,
        },
      },
    });
  }

  async findById({ userId }: { userId: string }) {
    return prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,

        isBlocked: true,
        updatedAt: true,
        createdAt: true,
      },
      where: { id: userId },
    });
  }

  async list({ loggedUserId, take = 20, page, search = '' }: IListUser) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        lastAccess: true,
        updatedAt: true,
        createdAt: true,
        isBlocked: true,
      },

      take,
      skip: (page - 1) * take,

      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        NOT: {
          id: loggedUserId,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const usersCount = await prisma.user.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        NOT: {
          id: loggedUserId,
        },
      },
    });

    return { users, usersCount };
  }
}
