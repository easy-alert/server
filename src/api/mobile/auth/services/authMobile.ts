import { prisma } from '../../../../../prisma';

export class AuthMobile {
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
