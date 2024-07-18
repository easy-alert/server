import { prisma } from '../../../../../prisma';
import { findMaintenanceHistoryActivityByIdService } from './findMaintenanceHistoryActivityByIdService';

export async function deleteMaintenanceHistoryActivityByIdService(id: string) {
  await findMaintenanceHistoryActivityByIdService(id);

  await prisma.maintenanceHistoryActivity.delete({ where: { id } });
}
