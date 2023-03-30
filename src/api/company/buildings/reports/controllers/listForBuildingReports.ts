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

  const { maintenancesHistory } = await buildingReportsServices.findBuildingMaintenancesHistory({
    companyId: req.Company.id,
    queryFilter,
  });

  const maintenances: IMaintenancesData[] = [];
  const counts = {
    completed: 0,
    pending: 0,
    expired: 0,
    totalCost: 0,
  };

  maintenancesHistory.forEach((maintenance) => {
    if (
      maintenance.MaintenanceReport.length > 0 &&
      maintenance.MaintenanceReport[0].cost !== null
    ) {
      counts.totalCost += maintenance.MaintenanceReport[0].cost;
    }

    switch (maintenance.MaintenancesStatus.name) {
      case 'completed':
        counts.completed += 1;
        break;

      case 'overdue':
        counts.completed += 1;
        break;

      case 'pending':
        counts.pending += 1;
        break;

      case 'expired':
        counts.expired += 1;
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
      responsible: maintenance.Maintenance.responsible,
      notificationDate: maintenance.notificationDate,
      resolutionDate: maintenance.resolutionDate,
      status: maintenance.MaintenancesStatus.name,
      cost: maintenance.MaintenanceReport.length > 0 ? maintenance.MaintenanceReport[0].cost : null,
    });
  });

  return res.status(200).json({ counts, maintenances });
}
