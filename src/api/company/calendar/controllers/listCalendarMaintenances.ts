// # region IMPORTS
import { Request, Response } from 'express';
import { addDays } from '../../../../utils/functions';

// CLASS
import { SharedCalendarServices } from '../../../shared/calendar/services/SharedCalendarServices';

const sharedCalendarServices = new SharedCalendarServices();

// #endregion

export async function listCalendarMaintenances(req: Request, res: Response) {
  const { Maintenances, MaintenancesPending } =
    await sharedCalendarServices.findMaintenancesHistoryService({
      companyId: req.Company.id,
    });

  // #region GENERATE FUTURE MAINTENANCES
  const Dates = [];

  Dates.push(...Maintenances);

  for (let i = 0; i < MaintenancesPending.length; i++) {
    const intervals = sharedCalendarServices.recurringDates({
      startDate: new Date(MaintenancesPending[i].notificationDate),
      endDate: addDays({ date: MaintenancesPending[i].notificationDate, days: 365 }),
      interval:
        MaintenancesPending[i].Maintenance.frequency *
        MaintenancesPending[i].Maintenance.FrequencyTimeInterval.unitTime,
      maintenanceData: MaintenancesPending[i],
    });
    Dates.push(...intervals);
  }

  for (let i = 0; i < Dates.length; i++) {
    let statusCount = {
      completed: 0,
      pending: 0,
      expired: 0,
    };
    for (let j = 0; j < Dates.length; j++) {
      if (Dates[i].notificationDate === Dates[j].notificationDate) {
        statusCount = {
          completed:
            Dates[j].MaintenancesStatus.name === 'completed' ||
            Dates[j].MaintenancesStatus.name === 'overdue'
              ? (statusCount.completed += 1)
              : (statusCount.pending += 0),

          pending:
            Dates[j].MaintenancesStatus.name === 'pending'
              ? (statusCount.pending += 1)
              : (statusCount.pending += 0),
          expired:
            Dates[j].MaintenancesStatus.name === 'expired'
              ? (statusCount.expired += 1)
              : (statusCount.pending += 0),
        };

        Dates[i] = { ...Dates[i], statusCount };
      }
    }
  }

  console.log(Dates);
  // #endregion

  return res.status(200).json({ Dates });
}
