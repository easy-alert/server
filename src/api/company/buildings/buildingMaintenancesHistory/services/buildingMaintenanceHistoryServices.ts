import { prisma } from '../../../../../../prisma';
import { IDeletePendingMaintenancesHistory } from './types';

export class BuildingMaintenanceHistoryServices {
  async deletePendingMaintenancesHistory({ buildingId }: IDeletePendingMaintenancesHistory) {
    await prisma.maintenanceHistory.deleteMany({
      where: {
        buildingId,
        maintenancesStatus: {
          name: 'pending',
        },
      },
    });
  }
}
