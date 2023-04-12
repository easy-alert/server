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

  async listExpired({ buildingId }: { buildingId: string }) {
    return prisma.maintenanceHistory.findMany({
      select: {
        Maintenance: {
          select: {
            element: true,
            activity: true,
          },
        },
        notificationDate: true,
        dueDate: true,
      },
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
