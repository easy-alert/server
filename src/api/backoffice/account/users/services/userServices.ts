import { prisma } from '../../../../../../prisma';
import { needExist } from '../../../../../utils/newValidator';

export class UserServices {
  async findById({ userId }: { userId: string }) {
    return prisma.user.findUnique({
      include: {
        Companies: {
          select: {
            Company: {
              select: {
                id: true,
                name: true,
                isBlocked: true,
                image: true,
              },
            },
          },
        },
        UserBuildingsPermissions: {
          select: {
            Building: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      where: {
        id: userId,
      },
    });
  }

  async list({ take = 20, page, search = '' }: { take?: number; page: number; search?: string }) {
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

  async findEmailPhoneById({ userId }: { userId: string }) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        phoneNumber: true,
      },
    });
  }

  async findUniqueUser({ email, phoneNumber }: { email: string; phoneNumber: string }) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
      },
    });
  }

  async updateUser({
    id,
    image,
    name,
    role,
    email,
    phoneNumber,
    isBlocked,
  }: {
    id: string;
    image: string;
    name: string;
    role: string;
    email: string;
    phoneNumber: string;
    isBlocked: boolean;
  }) {
    return prisma.user.update({
      where: { id },
      data: {
        image,
        name,
        role,
        email,
        phoneNumber,
        isBlocked,
      },
    });
  }

  async updateUserPassword({ id, password }: { id: string; password: string }) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash: password },
    });
  }

  async changeIsBlocked({ userId }: { userId: string }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    needExist([{ label: 'Usuário', variable: user }]);
    return prisma.user.update({
      where: { id: userId },
      data: { isBlocked: !user!.isBlocked },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        lastAccess: true,
      },
    });
  }
}

export const userServices = new UserServices();
