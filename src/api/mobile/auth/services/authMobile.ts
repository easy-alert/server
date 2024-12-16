import { prisma } from '../../../../../prisma';

export class AuthMobile {
  async canLogin({
    email,
    phoneNumber,
  }: {
    email: string;
    phoneNumber: string;
  }): Promise<{ canLogin: boolean; hasPassword: boolean }> {
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
      },
    });

    return { canLogin: !!user, hasPassword: !!user?.password };
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
}
