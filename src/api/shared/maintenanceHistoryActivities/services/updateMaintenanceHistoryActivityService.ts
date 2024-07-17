import { prismaTypes, prisma } from '../../../../../prisma';
import { findMaintenanceHistoryActivityByIdService } from './findMaintenanceHistoryActivityByIdService';

export async function updateMaintenanceHistoryActivityService<
  T extends prismaTypes.MaintenanceHistoryActivityUpdateArgs,
>(args: prismaTypes.SelectSubset<T, prismaTypes.MaintenanceHistoryActivityUpdateArgs>) {
  await findMaintenanceHistoryActivityByIdService(args.where.id || '');

  return prisma.maintenanceHistoryActivity.update(args);
}
