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
      dates.push({ ...maintenanceData, notificationDate: date });
      date = noWeekendTimeDate({ date: addTimeDate({ date, days: interval }), interval });
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
        where: {
          companyId,
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
          buildingId,
          MaintenancesStatus: {
            NOT: {
              name: 'pending',
            },
          },

          OR: [{ notificationDate: { lte: endDate, gte: startDate } }],
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
          buildingId,
          MaintenancesStatus: {
            name: 'pending',
          },

          OR: [{ notificationDate: { lte: endDate, gte: startDate } }],
        },
      }),
    ]);

    return { Filter, Maintenances, MaintenancesPending };
  }
}
