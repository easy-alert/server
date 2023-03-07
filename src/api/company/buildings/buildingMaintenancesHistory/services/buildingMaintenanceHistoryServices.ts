import { prisma } from '../../../../../../prisma';
import { IDeletePendingMaintenancesHistory } from './types';

export class BuildingMaintenanceHistoryServices {
  async deletePendingMaintenancesHistory({ maintenancesIds }: IDeletePendingMaintenancesHistory) {
    await prisma.maintenanceHistory.deleteMany({
      where: {
        maintenanceId: {
          in: maintenancesIds,
        },

        MaintenancesStatus: {
          name: 'pending',
        },
      },
    });
  }
}
