import { prismaTypes, prisma } from '../../../../../prisma';

export async function createMaintenanceHistoryActivityService<
  T extends prismaTypes.MaintenanceHistoryActivityCreateArgs,
>(args: prismaTypes.SelectSubset<T, prismaTypes.MaintenanceHistoryActivityCreateArgs>) {
  return prisma.maintenanceHistoryActivity.create(args);
}
