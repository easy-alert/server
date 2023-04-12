import { prisma } from '../../../../../prisma';

export class ExternalServices {
  async countExpired({ buildingId }: { buildingId: string }) {
    return prisma.maintenanceHistory.count({
      where: {
        AND: {
          MaintenancesStatus: {
            name: 'expired',
          },
          buildingId,
        },
      },
    });
  }
}
