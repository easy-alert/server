import { prisma } from '../../../../../prisma';

import { ICreateCompany } from './types';

export class CompanyUserServices {
  // #region create
  async create({ name, CNPJ = null, CPF = null, contactNumber, image }: ICreateCompany) {
    return prisma.company.create({
      data: {
        name,
        CNPJ,
        CPF,
        contactNumber,
        image,
      },
    });
  }

  async createUserCompany({
    userId,
    companyId,
    owner = false,
  }: {
    userId: string;
    companyId: string;
    owner?: boolean;
  }) {
    return prisma.userCompanies.create({
      data: {
        companyId,
        userId,
        owner,
      },
    });
  }
  // #endregion

  // #region edit
  async unlinkUserCompany({ userId, companyId }: { userId: string; companyId: string }) {
    return prisma.userCompanies.delete({
      where: {
        userId_companyId: {
          companyId,
          userId,
        },
      },
    });
  }

  async deleteUserPermissions({ userId }: { userId: string }) {
    return prisma.userPermissions.deleteMany({
      where: {
        userId,
      },
    });
  }

  async deleteUserBuildingsPermissions({ userId }: { userId: string }) {
    return prisma.userBuildingsPermissions.deleteMany({
      where: {
        userId,
      },
    });
  }

  // #endregion

  // region find
  async findUserCompany({ userId, companyId }: { userId: string; companyId: string }) {
    const user = await prisma.userCompanies.findFirst({
      where: {
        userId,
        companyId,
      },
    });

    return user;
  }

  async findByEmailOrPhone({ userInfo }: { userInfo: string }) {
    const user = await prisma.user.findFirst({
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
        passwordHash: true,

        lastAccess: true,
        isBlocked: true,

        createdAt: true,
        updatedAt: true,

        Companies: {
          select: {
            Company: {
              select: {
                id: true,
                name: true,
                contactNumber: true,
                CNPJ: true,
                CPF: true,
                createdAt: true,
                image: true,
                isBlocked: true,
                ticketInfo: true,
                ticketType: true,
              },
            },
          },
        },

        Permissions: {
          select: { Permission: { select: { name: true } } },
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
        },
      },

      where: {
        OR: [{ email: userInfo }, { phoneNumber: userInfo }],
      },
    });

    return user;
  }
}
