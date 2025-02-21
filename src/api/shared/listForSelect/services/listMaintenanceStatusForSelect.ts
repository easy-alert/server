import { prisma } from '../../../../../prisma';

export async function listMaintenanceStatusForSelect() {
  return prisma.maintenancesStatus.findMany({
    select: {
      id: true,
      name: true,
      singularLabel: true,
      pluralLabel: true,
    },

    orderBy: {
      name: 'asc',
    },
  });
}
