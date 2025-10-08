import { Request, Response } from 'express';
import { changeTime } from '../../../../utils/dateTime/changeTime';

import { SharedCalendarServices } from '../../../shared/calendar/services/SharedCalendarServices';
import { buildingServices } from '../../buildings/building/services/buildingServices';
import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../utils/permissions/handlePermittedBuildings';
import { addDays, removeDays } from '../../../../utils/dateTime';

const sharedCalendarServices = new SharedCalendarServices();

const groupBy = <T>(data: T[], key: keyof T): Record<string, T[]> =>
  data.reduce((result: Record<string, T[]>, item: T) => {
    const groupKey = String(item[key]);
    const group = result[groupKey] || [];
    return {
      ...result,
      [groupKey]: [...group, item],
    };
  }, {});

export async function listCalendarMaintenances(req: Request, res: Response) {
  const { year, month, buildingIds } = req.query as {
    year?: string;
    month?: string;
    buildingIds?: string;
  };

  let filterBuildingIds =
    !buildingIds || buildingIds === 'undefined' ? undefined : buildingIds.split(',');

  if (!filterBuildingIds) {
    if (hasAdminPermission(req.Permissions)) {
      filterBuildingIds = undefined;
    } else {
      filterBuildingIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');
    }
  }

  const currentYear = Number(year) || new Date().getFullYear();
  const currentMonth = month !== undefined ? Number(month) : undefined;

  let startDate: Date;
  let endDate: Date;

  if (typeof currentMonth === 'number' && !Number.isNaN(currentMonth)) {
    // Mês informado (1 a 12)
    startDate = new Date(currentYear, currentMonth - 1, 1);
    endDate = new Date(currentYear, currentMonth, 0);
    endDate = addDays({ date: endDate, days: 5 });
    startDate = removeDays({ date: startDate, days: 5 });
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

  for (const maintenance of MaintenancesPending) {
    const isOccasional = maintenance.Maintenance?.MaintenanceType?.name === 'occasional';

    if (isOccasional) {
      Dates.push({ ...maintenance });
      continue;
    }

    if (new Date(maintenance.dueDate) < new Date()) {
      maintenance.MaintenancesStatus = {
        name: 'expired',
        pluralLabel: 'vencidas',
        singularLabel: 'vencida',
      }
    }

    const foundBuildingMaintenance =
      await buildingServices.findBuildingMaintenanceDaysToAnticipate({
        buildingId: maintenance.Building.id,
        maintenanceId: maintenance.Maintenance.id,
      });

    const recurringMaintenances = sharedCalendarServices.recurringDates({
      startDate: changeTime({
        date: new Date(maintenance.notificationDate),
        time: { h: 0, m: 0, ms: 0, s: 0 },
      }),
      endDate: changeTime({
        date: endDate,
        time: { h: 0, m: 0, ms: 0, s: 0 },
      }),
      interval:
        maintenance.Maintenance.frequency *
          maintenance.Maintenance.FrequencyTimeInterval.unitTime -
        (foundBuildingMaintenance?.daysToAnticipate ?? 0),
      maintenanceData: maintenance,
      periodDaysInterval:
        maintenance.Maintenance.period *
          maintenance.Maintenance.PeriodTimeInterval.unitTime +
        (foundBuildingMaintenance?.daysToAnticipate ?? 0),
    });

    Dates.push(...recurringMaintenances);
  }

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
