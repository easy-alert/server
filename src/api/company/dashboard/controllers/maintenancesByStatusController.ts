import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

import { handleDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';
import { setToMidnight } from '../../../../utils/dateTime';

export async function maintenancesByStatusController(req: Request, res: Response) {
  const { buildings, categories, responsible, startDate, endDate, maintenanceType } = req.query;

  const startDateFormatted = startDate ? setToMidnight(startDate as string) : undefined;
  const endDateFormatted = endDate ? setToMidnight(endDate as string) : undefined;

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

  const maintenances = await dashboardServices.maintenancesByStatus({
    filter: dashboardFilter,
    maintenanceType: maintenanceType ? (maintenanceType as 'common' | 'occasional') : undefined,
  });

  const maintenancesStatusData: { data: number[]; labels: string[]; colors: string[] } = {
    data: [
      maintenances.completedMaintenances,
      maintenances.expiredMaintenances,
      maintenances.pendingMaintenances,
      maintenances.inProgressMaintenances,
    ],
    labels: ['Concluídas', 'Vencidas', 'Pendentes', 'Em Andamento'],
    colors: ['#34B53A', '#FF3508', '#FFB200', '#007BFF'],
  };

  return res.status(200).json({ ...maintenancesStatusData });
}
