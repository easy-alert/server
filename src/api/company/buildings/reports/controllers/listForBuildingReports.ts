// #region IMPORTS
import { Request, Response } from 'express';
import { BuildingReportsServices } from '../services/buildingReportsServices';
import { IMaintenancesData } from '../services/types';

// CLASS
// import { Validator } from '../../../../../utils/validator/validator';

// const validator = new Validator();

const buildingReportsServices = new BuildingReportsServices();

// #endregion

export async function listForBuildingReports(req: Request, res: Response) {
  // @ts-ignore                                         por causa do bug do PaserdQs
  const queryFilter = buildingReportsServices.mountQueryFilter({ query: req.query });

  const maintenancesHistory = await buildingReportsServices.findBuildingMaintenancesHistory({
    queryFilter,
  });

  const maintenances: IMaintenancesData[] = [];
  const statusCount = {
    completed: 0,
    pending: 0,
    expired: 0,
  };

  let totalCost = 0;

  maintenancesHistory.forEach((maintenance) => {
    if (
      maintenance.MaintenanceReport.length > 0 &&
      maintenance.MaintenanceReport[0].cost !== null
    ) {
      totalCost += maintenance.MaintenanceReport[0].cost;
    }

    switch (maintenance.MaintenancesStatus.name) {
      case 'completed':
        statusCount.completed += 1;
        break;

      case 'overdue':
        statusCount.completed += 1;
        break;

      case 'pending':
        statusCount.pending += 1;
        break;

      case 'expired':
        statusCount.expired += 1;
        break;

      default:
        break;
    }

    maintenances.push({
      maintenanceHistoryId: maintenance.id,
      buildingName: maintenance.Building.name,
      categoryName: maintenance.Maintenance.Category.name,
      element: maintenance.Maintenance.element,
      activity: maintenance.Maintenance.activity,
      responsible: maintenance.Building.NotificationsConfigurations[0].name,
      notificationDate: maintenance.notificationDate,
      resolutionDate: maintenance.resolutionDate,
      status: maintenance.MaintenancesStatus.name,
      cost: maintenance.MaintenanceReport.length > 0 ? maintenance.MaintenanceReport[0].cost : null,
    });
  });

  return res.status(200).json({ totalCost, statusCount, maintenances });
}
