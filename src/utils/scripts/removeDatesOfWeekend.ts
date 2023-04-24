import { Request, Response } from 'express';
import { prisma } from '../../../prisma';
import { noWeekendTimeDate } from '../dateTime/noWeekendTimeDate';

async function findManyMaintenanceHistory() {
  return prisma.maintenanceHistory.findMany({
    select: {
      id: true,
      notificationDate: true,
      Maintenance: {
        select: {
          frequency: true,
          FrequencyTimeInterval: {
            select: {
              unitTime: true,
            },
          },
        },
      },
    },
    where: {
      MaintenancesStatus: {
        name: 'pending',
      },
    },
  });
}

async function updateNotificationDate(maintenanceHistoryId: string, notificationDate: Date) {
  await prisma.maintenanceHistory.update({
    data: {
      notificationDate,
    },

    where: {
      id: maintenanceHistoryId,
    },
  });
}

export async function removeDatesOfWeekend(req: Request, res: Response) {
  const maintenanceHistory = await findManyMaintenanceHistory();

  for (let i = 0; i < maintenanceHistory.length; i++) {
    const notificationDay = maintenanceHistory[i].notificationDate.getDay();
    if (notificationDay === 0 || notificationDay === 6) {
      await updateNotificationDate(
        maintenanceHistory[i].id,
        noWeekendTimeDate({
          date: maintenanceHistory[i].notificationDate,
          interval:
            maintenanceHistory[i].Maintenance.frequency *
            maintenanceHistory[i].Maintenance.FrequencyTimeInterval.unitTime,
        }),
      );
    }
  }

  res.sendStatus(200);
}
