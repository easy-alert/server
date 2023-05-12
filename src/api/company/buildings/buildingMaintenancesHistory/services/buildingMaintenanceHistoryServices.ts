import { prisma } from '../../../../../../prisma';
import { IDeletePendingMaintenancesHistory } from './types';

export class BuildingMaintenanceHistoryServices {
  async deletePendingMaintenancesHistory({
    maintenancesIds,
    buildingId,
  }: IDeletePendingMaintenancesHistory) {
    await prisma.maintenanceHistory.deleteMany({
      where: {
        maintenanceId: {
          in: maintenancesIds,
        },
        buildingId,
        MaintenancesStatus: {
          name: 'pending',
        },
        wasNotified: false,
      },
    });
  }
}
