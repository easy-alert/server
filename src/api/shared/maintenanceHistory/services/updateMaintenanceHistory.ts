import { prisma, prismaTypes } from '../../../../../prisma';

export async function updateMaintenanceHistory({
  ...data
}: prismaTypes.MaintenanceHistoryUpdateInput) {
  return prisma.maintenanceHistory.update({
    where: {
      id: data.id as string,
    },

    data: {
      ...data,
    },
  });
}
