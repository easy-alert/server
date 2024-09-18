import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { Validator } from '../../../../utils/validator/validator';
import { IMaintenancesData } from '../../../company/buildings/reports/services/types';

const validator = new Validator();

export async function findSupplierMaintenanceHistory(req: Request, res: Response) {
  const { supplierId } = req.params as any as { supplierId: string };

  validator.check([{ label: 'ID do fornecedor', type: 'string', variable: supplierId }]);

  const maintenanceHistory = await supplierServices.findMaintenanceHistory({ supplierId });

  const maintenances: IMaintenancesData[] = [];

  maintenanceHistory.forEach((maintenance) => {
    const hasReport = maintenance.MaintenanceReport.length > 0;

    maintenances.push({
      id: maintenance.id,

      dueDate: maintenance.dueDate,
      maintenanceHistoryId: maintenance.id,
      buildingName: maintenance.Building.name,
      categoryName: maintenance.Maintenance.Category.name,
      element: maintenance.Maintenance.element,
      activity: maintenance.Maintenance.activity,
      responsible: maintenance.Maintenance.responsible,
      source: maintenance.Maintenance.source,
      notificationDate: maintenance.notificationDate,
      maintenanceObservation: maintenance.Maintenance.observation,
      resolutionDate: maintenance.resolutionDate,
      status: maintenance.MaintenancesStatus.name,
      type: maintenance.Maintenance.MaintenanceType?.name ?? null,
      inProgress: maintenance.inProgress,

      cost: hasReport ? maintenance.MaintenanceReport[0].cost : null,

      reportObservation: hasReport ? maintenance.MaintenanceReport[0].observation : null,

      images: hasReport ? maintenance.MaintenanceReport[0].ReportImages : [],
      annexes: hasReport ? maintenance.MaintenanceReport[0].ReportAnnexes : [],
    });
  });

  maintenances.sort((a, b) => b.notificationDate.getTime() - a.notificationDate.getTime());

  return res.status(200).json({ maintenances });
}
