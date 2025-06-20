import { prisma, type prismaTypes } from '../../../../../prisma';

export async function findUniqueMaintenanceHistory<T>({
  data,
}: {
  data: prismaTypes.MaintenanceHistoryFindUniqueArgs;
}): Promise<T | null> {
  return prisma.maintenanceHistory.findUnique(data) as Promise<T | null>;
}
