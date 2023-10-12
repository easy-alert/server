// TYPES
// import { Validator } from '../../../../utils/validator/validator';
// import { prisma } from '../../../../../prisma';
import { prisma } from '../../../../../prisma';
import { addDays } from '../../../../utils/dateTime';
import { noWeekendTimeDate } from '../../../../utils/dateTime/noWeekendTimeDate';

import { IRecurringDates } from './types';

// CLASS

// const validator = new Validator();

export class SharedCalendarServices {
  recurringDates({
    startDate,
    endDate,
    interval,
    maintenanceData,
    periodDaysInterval,
  }: IRecurringDates) {
    let date = startDate;
    const dates = [];
    let isFuture = false;
    while (date < endDate) {
      dates.push({
        ...maintenanceData,
        notificationDate: date,
        isFuture,
        periodDaysInterval,
        expectedNotificationDate: date,
        expectedDueDate: noWeekendTimeDate({
          date: addDays({
            date,
            days: periodDaysInterval,
          }),
          interval: periodDaysInterval,
        }),
        type: maintenanceData.Maintenance.MaintenanceType?.name || null,
      });
      date = noWeekendTimeDate({
        date: addDays({ date, days: interval }),
        interval: periodDaysInterval,
      });
      isFuture = true;
    }

    return dates;
  }

  async findMaintenancesHistoryService({
    companyId,
    buildingId,
    startDate,
    endDate,
  }: {
    companyId: string;
    buildingId: string | undefined;
    startDate: Date;
    endDate: Date;
  }) {
    const [Filter, Maintenances, MaintenancesPending] = await prisma.$transaction([
      prisma.building.findMany({
        select: { id: true, name: true },
        orderBy: {
          name: 'asc',
        },
        where: {
          companyId,
        },
      }),

      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          resolutionDate: true,
          inProgress: true,

          Building: {
            select: {
              id: true,
              name: true,
            },
          },
          Maintenance: {
            select: {
              id: true,
              element: true,
              frequency: true,
              FrequencyTimeInterval: {
                select: {
                  unitTime: true,
                  singularLabel: true,
                  pluralLabel: true,
                },
              },
              MaintenanceType: {
                select: {
                  name: true,
                },
              },
            },
          },
          MaintenancesStatus: {
            select: {
              name: true,
              pluralLabel: true,
              singularLabel: true,
            },
          },
        },
        where: {
          ownerCompanyId: companyId,
          buildingId,
          MaintenancesStatus: {
            NOT: {
              name: 'pending',
            },
          },

          OR: [
            { notificationDate: { lte: endDate, gte: startDate } },
            { resolutionDate: { gte: startDate } },
          ],
        },
      }),

      prisma.maintenanceHistory.findMany({
        select: {
          id: true,
          notificationDate: true,
          inProgress: true,

          Building: {
            select: {
              id: true,
              name: true,
            },
          },
          Maintenance: {
            select: {
              id: true,
              element: true,
              frequency: true,
              FrequencyTimeInterval: {
                select: {
                  unitTime: true,
                  singularLabel: true,
                  pluralLabel: true,
                },
              },

              period: true,
              PeriodTimeInterval: {
                select: {
                  unitTime: true,
                  singularLabel: true,
                  pluralLabel: true,
                },
              },

              MaintenanceType: {
                select: {
                  name: true,
                },
              },
            },
          },
          MaintenancesStatus: {
            select: {
              name: true,
              pluralLabel: true,
              singularLabel: true,
            },
          },
        },
        where: {
          ownerCompanyId: companyId,
          buildingId,

          MaintenancesStatus: {
            name: 'pending',
          },

          // OR: [{ notificationDate: { lte: endDate, gte: startDate } }],
          OR: [{ notificationDate: { lte: endDate } }],
        },
      }),
    ]);

    return { Filter, Maintenances, MaintenancesPending };
  }
}
