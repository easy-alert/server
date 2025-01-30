import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

import { getPeriod } from '../../../../utils/dateTime/getPeriod';
import { handleDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';

export async function maintenancesByStatusController(req: Request, res: Response) {
  const { period, buildings, categories, responsible } = req.query;
  const { startDate, endDate } = getPeriod(period as string | undefined);

  const dashboardFilter = handleDashboardFilter({
    companyId: req.Company.id,
    buildings: buildings as string[],
    categories: categories as string | string[],
    responsible: responsible as string | string[],
    startDate,
    endDate,
    permissions: req.Permissions,
    buildingsPermissions: req.BuildingsPermissions,
  });

  const maintenances = await dashboardServices.maintenancesByStatus({
    filter: dashboardFilter,
  });

  const maintenancesStatusData: { data: number[]; labels: string[]; colors: string[] } = {
    data: [
      maintenances.completedMaintenances,
      maintenances.expiredMaintenances,
      maintenances.pendingMaintenances,
    ],
    labels: ['Concluídas', 'Vencidas', 'Pendentes'],
    colors: ['#34B53A', '#FF3508', '#FFB200'],
  };

  return res.status(200).json({ ...maintenancesStatusData });
}
