import { compare } from 'bcrypt';

import { prisma } from '../../../../../prisma';

import { ServerMessage } from '../../../../utils/messages/serverMessage';

export class AuthServices {
  async canLogin({ login, password }: { login: string; password: string }) {
    const user = await this.findByEmailOrPhone({ login });

    const isValuePassword = await compare(password, user.passwordHash);

    if (!isValuePassword) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'E-mail ou senha incorretos.',
      });
    }

    const companyIsBlocked = user.Companies.some((company) => company.Company.isBlocked === true);

    if (user.isBlocked || companyIsBlocked) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Sua conta está bloqueada, entre em contato com a administração.',
      });
    }

    return user!;
  }

  async login({
    email,
    phoneNumber,
    password,
  }: {
    email: string;
    phoneNumber: string;
    password: string;
  }) {
    const user = await prisma.buildingNotificationConfiguration.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            contactNumber: phoneNumber,
          },
        ],

        AND: {
          password,
        },
      },
    });

    return user;
  }

  async changePassword({
    email,
    phoneNumber,
    password,
  }: {
    email: string;
    phoneNumber: string;
    password: string;
  }) {
    const userList = await prisma.buildingNotificationConfiguration.findMany({
      where: {
        OR: [
          {
            email,
          },
          {
            contactNumber: phoneNumber,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!userList.length || !userList[0].id) {
      throw new Error('Usuário não encontrado.');
    }

    userList.forEach(async (user) => {
      await prisma.buildingNotificationConfiguration.update({
        where: {
          id: user.id,
        },
        data: {
          password,
        },
      });
    });
  }

  async listBuildings({ phoneNumber }: { phoneNumber: string }) {
    const buildings = await prisma.buildingNotificationConfiguration.findMany({
      where: {
        contactNumber: phoneNumber,
      },
      select: {
        nanoId: true,
        contactNumber: true,
        email: true,
        Building: {
          select: {
            nanoId: true,
            name: true,
          },
        },
      },
    });

    return buildings.map((building: any) => ({
      syndicNanoId: building.nanoId,
      contactNumber: building.contactNumber,
      email: building.email,
      buildingNanoId: building.Building?.nanoId,
      buildingName: building.Building?.name,
    }));
  }

  async findByEmailOrPhone({ login }: { login: string }) {
    const User = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
        lastAccess: true,
        passwordHash: true,
        updatedAt: true,
        isBlocked: true,

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
        OR: [{ email: login }, { phoneNumber: login }],
      },
    });

    if (!User) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'E-mail ou senha incorretos.',
      });
    }

    return User;
  }

  async isCompanyOwner({ userId, companyId }: { userId: string; companyId: string }) {
    if (!companyId) return false;

    const owner = prisma.userCompanies
      .findUnique({
        where: { userId_companyId: { userId, companyId } },
        select: { owner: true },
      })
      .then((userCompany) => userCompany?.owner ?? false);

    return owner;
  }
}
