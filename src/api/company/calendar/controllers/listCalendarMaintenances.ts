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

  // #endregion

  return res.status(200).json({ Dates });
}
