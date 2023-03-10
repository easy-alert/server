// # region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { SharedCalendarServices } from '../../../shared/calendar/services/SharedCalendarServices';

const sharedCalendarServices = new SharedCalendarServices();

// #endregion

export async function listCalendarMaintenances(req: Request, res: Response) {
  const YEARFORSUM = 5;

  const { year } = req.params;
  const filter = req.query;
  const buildingId = filter.buildingId ? String(filter.buildingId) : undefined;

  // #region GENERATE HISTORY MAINTENANCES
  const { Filter, Maintenances, MaintenancesPending } =
    await sharedCalendarServices.findMaintenancesHistoryService({
      companyId: req.Company.id,
      startDate: new Date(`01/01/${year}`),
      endDate: new Date(`12/31/${Number(year) + YEARFORSUM}`),
      buildingId,
    });

  const Dates = [];

  Maintenances.forEach((maintenance) => {
    Dates.push({
      ...maintenance,
      notificationDate: maintenance.resolutionDate ?? maintenance.notificationDate,
    });
  });
  // #endregion

  // #region GENERATE FUTURE MAINTENANCES

  for (let i = 0; i < MaintenancesPending.length; i++) {
    const intervals = sharedCalendarServices.recurringDates({
      startDate: new Date(MaintenancesPending[i].notificationDate),
      endDate: new Date(`01/01/${Number(year) + YEARFORSUM}`),
      interval:
        MaintenancesPending[i].Maintenance.frequency *
        MaintenancesPending[i].Maintenance.FrequencyTimeInterval.unitTime,
      maintenanceData: MaintenancesPending[i],
      periodDaysInterval:
        MaintenancesPending[i].Maintenance.period *
        MaintenancesPending[i].Maintenance.PeriodTimeInterval.unitTime,
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

  const DatesMonths = [];

  for (let i = 0; i < arr.length; i += 1) {
    DatesMonths.push({
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
    Filter,
    Dates: {
      Months: DatesMonths,
      Weeks: Dates,
    },
  });
}
