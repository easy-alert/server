// # region IMPORTS
import { Request, Response } from 'express';
import { addDays } from '../../../../utils/functions';

// CLASS
import { SharedCalendarServices } from '../../../shared/calendar/services/SharedCalendarServices';

const sharedCalendarServices = new SharedCalendarServices();

// #endregion

export async function listCalendarMaintenances(req: Request, res: Response) {
  const { year } = req.params;

  // TODO: ajustar filtro , nao esta considerando as datas
  const { Maintenances, MaintenancesPending } =
    await sharedCalendarServices.findMaintenancesHistoryService({
      companyId: req.Company.id,
      startDate: new Date(`01/01/${year}`),
      endDate: new Date(`12/31/${year}`),
    });

  // #region GENERATE FUTURE MAINTENANCES
  const Dates: any = [];

  Dates.push(...Maintenances);

  for (let i = 0; i < MaintenancesPending.length; i++) {
    const intervals = sharedCalendarServices.recurringDates({
      startDate: new Date(MaintenancesPending[i].notificationDate),
      endDate: addDays({ date: new Date(`01/01/${year}`), days: 1824 }),
      interval:
        MaintenancesPending[i].Maintenance.frequency *
        MaintenancesPending[i].Maintenance.FrequencyTimeInterval.unitTime,
      maintenanceData: MaintenancesPending[i],
    });
    Dates.push(...intervals);
  }

  const groupBy = (data: any, key: any) =>
    data.reduce((storage: any, item: any) => {
      const group = item[key];
      // eslint-disable-next-line no-param-reassign
      storage[group] = storage[group] || [];
      storage[group].push(item);
      return storage;
    }, {});

  const gp = groupBy(Dates, 'notificationDate');

  const arr = Object.keys(gp).map((k) => gp[k]);

  const DatesWeeks = [];

  for (let i = 0; i < arr.length; i += 1) {
    DatesWeeks.push({
      id: arr[i][0].notificationDate,
      date: arr[i][0].notificationDate,
      pending: arr[i].filter((e: any) => e.MaintenancesStatus.name === 'pending').length,
      completed: arr[i].filter(
        (e: any) =>
          e.MaintenancesStatus.name === 'completed' || e.MaintenancesStatus.name === 'overdue',
      ).length,
      expired: arr[i].filter((e: any) => e.MaintenancesStatus.name === 'expired').length,
    });
  }

  // #endregion

  return res.status(200).json({
    Dates: {
      Months: DatesWeeks,
      Weeks: Dates,
    },
  });
}
