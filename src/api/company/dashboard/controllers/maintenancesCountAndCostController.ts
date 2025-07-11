import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

import { handleDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';
import { mask } from '../../../../utils/masks';
import { setToLastMinuteOfDay, setToMidnight } from '../../../../utils/dateTime';

export async function maintenancesCountAndCostController(req: Request, res: Response) {
  const { buildings, categories, responsible, maintenanceType, startDate, endDate } = req.query;

  const startDateFormatted = startDate ? setToMidnight(startDate as string) : undefined;
  const endDateFormatted = endDate ? setToLastMinuteOfDay(endDate as string) : undefined;

  const dashboardFilter = handleDashboardFilter({
    companyId: req.Company.id,
    buildings: buildings as string[],
    categories: categories as string | string[],
    responsible: responsible as string | string[],
    startDate: startDateFormatted,
    endDate: endDateFormatted,
    permissions: req.Permissions,
    buildingsPermissions: req.BuildingsPermissions,
  });

  const countAndCostMaintenances = await dashboardServices.maintenancesCountAndCost({
    filter: dashboardFilter,
    maintenanceType: maintenanceType ? (maintenanceType as 'common' | 'occasional') : undefined,
  });

  const maintenancesCost = `Valor investido ${mask({
    type: 'BRL',
    value: String(countAndCostMaintenances.maintenancesCost),
  })}`;

  return res.status(200).json({ ...countAndCostMaintenances, maintenancesCost });
}
