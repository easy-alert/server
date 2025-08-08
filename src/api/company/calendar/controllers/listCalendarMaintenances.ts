import { Request, Response } from 'express';
import { changeTime } from '../../../../utils/dateTime/changeTime';

import { SharedCalendarServices } from '../../../shared/calendar/services/SharedCalendarServices';
import { buildingServices } from '../../buildings/building/services/buildingServices';
import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../utils/permissions/handlePermittedBuildings';

const sharedCalendarServices = new SharedCalendarServices();

export async function listCalendarMaintenances(req: Request, res: Response) {
  const { year, month, buildingIds } = req.query as {
    year?: string;
    month?: string;
    buildingIds?: string;
  };

  let filterBuildingIds =
    !buildingIds || buildingIds === 'undefined' ? undefined : buildingIds.split(',');

  if (hasAdminPermission(req.Permissions)) {
    filterBuildingIds = undefined;
  } else if (!filterBuildingIds) {
    filterBuildingIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');
  }

  const currentYear = Number(year) || new Date().getFullYear();
  const currentMonth = month !== undefined ? Number(month) : undefined;

  let startDate: Date;
  let endDate: Date;

  if (typeof currentMonth === 'number' && !Number.isNaN(currentMonth)) {
    // Mês informado (1 a 12)
    startDate = new Date(currentYear, currentMonth - 1, 1);
    endDate = new Date(currentYear, currentMonth, 0);
  } else {
    // Intervalo de 5 anos
    const YEARFORSUM = 5;
    startDate = new Date(currentYear, 0, 1);
    endDate = new Date(currentYear + YEARFORSUM, 11, 31);
  }

  const { Filter, Maintenances, MaintenancesPending } =
    await sharedCalendarServices.findMaintenancesHistoryService({
      companyId: req.Company.id,
      startDate,
      endDate,
      buildingIds: filterBuildingIds,
    });

  const Dates = [];

  Maintenances.forEach((maintenance) => {
    Dates.push({
      ...maintenance,
      notificationDate: maintenance.resolutionDate ?? maintenance.notificationDate,
    });
  });

  for (let i = 0; i < MaintenancesPending.length; i++) {
    if (MaintenancesPending[i].Maintenance?.MaintenanceType?.name === 'occasional') {
      Dates.push({ ...MaintenancesPending[i] });
    } else {
      const foundBuildingMaintenance =
        await buildingServices.findBuildingMaintenanceDaysToAnticipate({
          buildingId: MaintenancesPending[i].Building.id,
          maintenanceId: MaintenancesPending[i].Maintenance.id,
        });

      const intervals = sharedCalendarServices.recurringDates({
        startDate: changeTime({
          date: new Date(MaintenancesPending[i].notificationDate),
          time: { h: 0, m: 0, ms: 0, s: 0 },
        }),
        endDate: changeTime({
          date: endDate,
          time: { h: 0, m: 0, ms: 0, s: 0 },
        }),
        interval:
          MaintenancesPending[i].Maintenance.frequency *
            MaintenancesPending[i].Maintenance.FrequencyTimeInterval.unitTime -
          (foundBuildingMaintenance?.daysToAnticipate ?? 0),
        maintenanceData: MaintenancesPending[i],
        periodDaysInterval:
          MaintenancesPending[i].Maintenance.period *
            MaintenancesPending[i].Maintenance.PeriodTimeInterval.unitTime +
          (foundBuildingMaintenance?.daysToAnticipate ?? 0),
      });

      Dates.push(...intervals);
    }
  }

  const groupBy = <T>(data: T[], key: keyof T): Record<string, T[]> =>
    data.reduce((result: Record<string, T[]>, item: T) => {
      const groupKey = String(item[key]);
      const group = result[groupKey] || [];
      return {
        ...result,
        [groupKey]: [...group, item],
      };
    }, {});

  const grouped = groupBy(Dates, 'notificationDate');
  const groupedArray = Object.keys(grouped).map((k) => grouped[k]);

  const DatesMonths = groupedArray.map((entries) => ({
    id: entries[0].notificationDate,
    date: entries[0].notificationDate,
    pending: entries.filter((e: any) => e.MaintenancesStatus.name === 'pending').length,
    completed: entries.filter(
      (e: any) =>
        e.MaintenancesStatus.name === 'completed' || e.MaintenancesStatus.name === 'overdue',
    ).length,
    expired: entries.filter((e: any) => e.MaintenancesStatus.name === 'expired').length,
  }));

  return res.status(200).json({
    Filter,
    Dates: {
      Months: DatesMonths,
      Weeks: Dates,
    },
  });
}
