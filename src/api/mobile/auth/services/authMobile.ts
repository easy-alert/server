import { prisma } from '../../../../../prisma';

export class AuthMobile {
  async listBuildings({ phoneNumber }: { phoneNumber: string }) {
    const buildings = await prisma.building.findMany({
      where: {
        NotificationsConfigurations: {
          some: {
            contactNumber: phoneNumber,
          },
        },
      },
      select: {
        nanoId: true,
        name: true,
        NotificationsConfigurations: {
          select: {
            nanoId: true,
            contactNumber: true,
            email: true,
          },
        },
      },
    });

    // Mapeia os dados no formato desejado
    return buildings.flatMap((building: any) =>
      building.NotificationsConfigurations.map(
        (config: { nanoId: string; contactNumber: string; email: string }) => ({
          buildingNanoId: building.nanoId,
          buildingName: building.name,
          syndicNanoId: config.nanoId,
          contactNumber: config.contactNumber,
          email: config.email,
        }),
      ),
    );
  }
}

