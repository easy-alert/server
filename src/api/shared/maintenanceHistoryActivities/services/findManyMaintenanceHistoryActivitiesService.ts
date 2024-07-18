import { prisma } from '../../../../../prisma';

export async function findManyMaintenanceHistoryActivitiesService(maintenanceHistoryId: string) {
  const maintenanceHistoryActivities = await prisma.maintenanceHistoryActivity.findMany({
    where: {
      maintenanceHistoryId,
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return { maintenanceHistoryActivities };
}
