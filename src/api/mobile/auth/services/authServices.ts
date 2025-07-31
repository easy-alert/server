import { compare } from 'bcrypt';

import { prisma } from '../../../../../prisma';

import { ServerMessage } from '../../../../utils/messages/serverMessage';

export class AuthServices {
  async canLogin({
    login,
    password,
    companyId,
    pushNotificationToken,
    deviceId,
    os,
  }: {
    login: string;
    password: string;
    companyId?: string;
    pushNotificationToken: string;
    deviceId: string;
    os: string;
  }) {
    const user = await this.findByEmailOrPhone({ login, companyId });

    if (user.Companies.length === 0) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Usuário não possui nenhuma empresa.',
      });
    }

    if (user.isBlocked) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Sua conta está bloqueada, entre em contato com a administração.',
      });
    }

    const isValuePassword = await compare(password, user.passwordHash);

    if (!isValuePassword) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Login ou senha incorretos.',
      });
    }

    if (user.Companies.length > 1 && companyId) {
      const selectedCompany = user.Companies.find((company) => company.Company.id === companyId);

      if (!selectedCompany) {
        throw new ServerMessage({
          statusCode: 400,
          message: 'Empresa não encontrada.',
        });
      }

      user.Companies = user.Companies.filter((company) => company.Company.id === companyId);
    }

    let companyIsBlocked = false;

    if (user.Companies.length === 1) {
      companyIsBlocked = user.Companies[0].Company.isBlocked;
    } else {
      companyIsBlocked =
        user.Companies.find((company) => company.Company.id === companyId)?.Company.isBlocked ??
        false;
    }

    if (companyIsBlocked) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'A empresa está bloqueada, entre em contato com a administração.',
      });
    }

    // Apenas registra o token se o usuário enviar os dados necessários
    if (deviceId && pushNotificationToken && os) {
      await prisma.$transaction(async (tx) => {
        // a) Existe um registro para o mesmo device?
        const existing = await tx.pushNotification.findFirst({
          where: { userId: user.id, deviceId },
        });

        if (existing) {
          // Atualiza token ou SO caso tenham mudado
          await tx.pushNotification.update({
            where: { id: existing.id },
            data: { token: pushNotificationToken, os },
          });
        } else {
          // b) Não existe: cria, ou reaproveita se o token já estiver salvo
          await tx.pushNotification.upsert({
            // token é único no schema → podemos usá-lo como chave do upsert
            where: { token: pushNotificationToken },
            create: {
              userId: user.id,
              deviceId,
              token: pushNotificationToken,
              os,
            },
            update: {
              userId: user.id,
              deviceId,
              os,
            },
          });
        }
      });
    }

    return user;
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

  async findByEmailOrPhone({ login, companyId }: { login: string; companyId?: string }) {
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

        PushNotification: {
          select: {
            id: true,

            deviceId: true,
            os: true,
            token: true,
            createdAt: true,
            updatedAt: true,
          },
        },

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
        },
      },

      where: {
        OR: [{ email: login }, { phoneNumber: login }],
      },
    });

    if (!user) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'E-mail ou senha incorretos.',
      });
    }

    return user;
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

  async buildingsPermissionForAdmin({ companyId }: { companyId: string }) {
    return prisma.building.findMany({
      select: {
        id: true,
        nanoId: true,
        name: true,
      },

      where: {
        companyId,
      },
    });
  }

  async updateLastAccess({ userId }: { userId: string }) {
    await prisma.user.update({
      where: { id: userId },
      data: { lastAccess: new Date() },
    });
  }
}
