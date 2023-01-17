// TYPES
// import { Validator } from '../../../../utils/validator/validator';
// import { prisma } from '../../../../../prisma';
import { prisma } from '../../../../../prisma';
import { addTimeDate } from '../../../../utils/dateTime';
import { noWeekendTimeDate } from '../../../../utils/dateTime/noWeekendTimeDate';

import { IRecurringDates } from './types';

// CLASS

// const validator = new Validator();

export class SharedCalendarServices {
  recurringDates({ startDate, endDate, interval, maintenanceData }: IRecurringDates) {
    let date = startDate;
    const dates = [];

    while (date < endDate) {
      // console.log(date);
      dates.push({ ...maintenanceData, notificationDate: date });
      date = noWeekendTimeDate({ date: addTimeDate({ date, days: interval }), interval });
    }

    return dates;
  }

  async findMaintenancesHistoryService({
    companyId,
    startDate,
    endDate,
  }: {
    companyId: string;
    startDate: Date;
    endDate: Date;
  }) {
    const [Maintenances, MaintenancesPending] = await prisma.$transaction([
      prisma.maintenanceHistory.findMany({
        select: {
          notificationDate: true,

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
          MaintenancesStatus: {
            NOT: {
              name: 'pending',
            },
          },
          notificationDate: {
            lte: endDate,
            gte: startDate,
          },
        },
      }),

      prisma.maintenanceHistory.findMany({
        select: {
          notificationDate: true,

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
          MaintenancesStatus: {
            name: 'pending',
          },
          notificationDate: {
            lte: endDate,
            gte: startDate,
          },
        },
      }),
    ]);

    return { Maintenances, MaintenancesPending };
  }
}
