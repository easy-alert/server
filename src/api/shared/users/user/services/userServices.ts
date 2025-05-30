// PRISMA
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { prisma } from '../../../../../../prisma';
import { Validator } from '../../../../../utils/validator/validator';

// TYPES
import { IEditUserPassword, IListUser } from '../types';

// CLASS
const validator = new Validator();

export class UserServices {
  // #region create
  async create({ image, name, role, email, phoneNumber, passwordHash }: Prisma.UserCreateInput) {
    return prisma.user.create({
      data: {
        image,
        name,
        role,
        email: email.toLowerCase(),
        phoneNumber,
        passwordHash: hashSync(passwordHash, 12),
      },
    });
  }

  // #endregion

  // #region edit
  async edit({
    userId,
    image,
    name,
    role,
    email,
    phoneNumber,
    colorScheme,
    isBlocked,
  }: Prisma.UserUpdateInput & { userId: string }) {
    return prisma.user.update({
      data: {
        image,
        name,
        role,
        email,
        phoneNumber,
        colorScheme,
        isBlocked,
      },

      select: {
        id: true,
        image: true,
        name: true,
        role: true,
        email: true,
        phoneNumber: true,
        colorScheme: true,
        isBlocked: true,
        createdAt: true,
        lastAccess: true,
      },

      where: { id: userId },
    });
  }

  async updateLastAccess({ userId }: { userId: string }) {
    await this.findById({ userId });

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

  // #endregion

  // #region find
  async findByEmail({ email }: { email: string }) {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        isBlocked: true,
        updatedAt: true,
        createdAt: true,
        Permissions: true,
      },

      where: { email: email.toLowerCase() },
    });
    validator.needExist([{ label: 'usuário', variable: user }]);

    return user!;
  }

  async findEmailForCreate({ email, phoneNumber }: { email: string; phoneNumber: string }) {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        isBlocked: true,
        updatedAt: true,
        createdAt: true,
        Permissions: true,
      },

      where: {
        email_phoneNumber: {
          email: email.toLowerCase(),
          phoneNumber,
        },
      },
    });

    return user;
  }

  async findByEmailForEdit({ email, userId }: { email: string; userId: string }) {
    const user = await prisma.user.findFirst({
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

    validator.cannotExists([{ variable: user, label: email }]);

    return user;
  }

  async findById({ companyId, userId }: { companyId?: string; userId: string }) {
    const user = await prisma.user.findUnique({
      select: {
        id: true,

        name: true,
        email: true,
        emailIsConfirmed: true,
        phoneNumber: true,
        phoneNumberIsConfirmed: true,
        role: true,
        image: true,
        colorScheme: true,

        lastAccess: true,
        isBlocked: true,

        createdAt: true,
        updatedAt: true,

        passwordHash: true,

        Companies: {
          select: {
            Company: {
              select: {
                id: true,

                image: true,
                name: true,
                contactNumber: true,

                CNPJ: true,
                CPF: true,

                isBlocked: true,
                ticketInfo: true,
                ticketType: true,
                canAccessChecklists: true,
                canAccessTickets: true,
                showMaintenancePriority: true,

                createdAt: true,
              },
            },
          },
        },

        Permissions: {
          select: { Permission: { select: { name: true } } },

          where: {
            companyId,
          },
        },

        UserBuildingsPermissions: {
          select: {
            Building: {
              select: {
                id: true,
                nanoId: true,
                name: true,
              },
            },
          },

          where: {
            Building: {
              companyId,
            },
          },
        },
      },

      where: {
        id: userId,
      },
    });

    validator.needExist([{ label: 'usuário', variable: user }]);

    return user!;
  }

  async findEmailPhoneById({ userId }: { userId: string }) {
    const user = await prisma.user.findUnique({
      select: {
        email: true,
        phoneNumber: true,
      },
      where: { id: userId },
    });

    validator.needExist([{ label: 'Usuário', variable: user }]);

    return user!;
  }

  async findOwner({ companyId }: { companyId: string }) {
    const user = await prisma.userCompanies.findFirst({
      where: { companyId, owner: true },
    });

    validator.needExist([{ label: 'usuário', variable: user }]);

    return user;
  }

  async findUniqueUser({ phoneNumber, email }: { phoneNumber: string; email: string }) {
    const user = await prisma.user.findUnique({
      where: {
        email_phoneNumber: {
          email: email.toLowerCase(),
          phoneNumber,
        },
      },
    });

    return user;
  }

  async findUniquePhone({ phoneNumber }: { phoneNumber: string }) {
    const user = await prisma.user.findUnique({
      include: {
        Companies: {
          select: {
            companyId: true,
          },
        },
      },

      where: { phoneNumber },
    });

    return user;
  }

  async findUniqueEmail({ email }: { email: string }) {
    const user = await prisma.user.findUnique({
      include: {
        Companies: {
          select: {
            companyId: true,
          },
        },
      },

      where: { email: email.toLowerCase() },
    });

    return user;
  }

  // #endregion

  async delete({ userId }: { userId: string }) {
    const user = await prisma.user.delete({ where: { id: userId } });

    validator.needExist([{ label: 'usuário', variable: user }]);

    return user;
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

  async findUserPermissions({ userId }: { userId: string }) {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: { id: userId },
    });

    validator.needExist([{ label: 'usuário', variable: user }]);

    return user!;
  }
}
