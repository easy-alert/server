import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

import { handleDashboardFilter } from '../../../../utils/filters/handleDashboardFilter';
import { mask } from '../../../../utils/dataHandler';
import { setToLastMinuteOfDay, setToMidnight } from '../../../../utils/dateTime';

export async function maintenancesByCategoriesController(req: Request, res: Response) {
  const { buildings, categories, responsible, startDate, endDate, maintenanceType } = req.query;

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

  const maintenances = await dashboardServices.maintenancesByCategories({
    filter: dashboardFilter,
    maintenanceType: maintenanceType ? (maintenanceType as 'common' | 'occasional') : undefined,
  });

  // Total number of maintenances
  const totalMaintenances = maintenances.length;

  // Total cost of maintenances
  const totalCost = maintenances.reduce((acc, maintenance) => {
    const cost = maintenance.MaintenanceReport.reduce((sum, report) => {
      const reportCost = report.cost || 0;
      return sum + reportCost;
    }, 0);
    return acc + cost;
  }, 0);
  const formattedTotalCost = mask({ value: totalCost.toString(), type: 'BRL' });

  // Group by category name and count
  const groupedCategories = maintenances.reduce((acc, maintenance) => {
    const categoryName = maintenance.Maintenance?.Category?.name || 'Unknown';
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format
  const categoriesArray = Object.entries(groupedCategories)
    .map(([category, count]) => ({
      category,
      count,
    }))
    .sort((a, b) => b.count - a.count); // Sort in descending order

  return res.status(200).json({
    totalMaintenances,
    totalCost: formattedTotalCost,
    categoriesArray,
  });
}
