import { prisma, type prismaTypes } from '../../../../../prisma';

export async function findManyMaintenanceHistories<T>({
  data,
}: {
  data: prismaTypes.MaintenanceHistoryFindManyArgs;
}): Promise<T[]> {
  return prisma.maintenanceHistory.findMany(data) as Promise<T[]>;
}
