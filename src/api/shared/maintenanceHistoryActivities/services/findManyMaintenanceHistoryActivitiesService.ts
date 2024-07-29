import { prisma } from '../../../../../prisma';

export async function findManyMaintenanceHistoryActivitiesService(maintenanceHistoryId: string) {
  const maintenanceHistoryActivities = await prisma.maintenanceHistoryActivity.findMany({
    where: {
      maintenanceHistoryId,
    },
    include: {
      images: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return { maintenanceHistoryActivities };
}
