// #region IMPORTS
import { Request, Response } from 'express';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { ICreateOccasionalMaintenanceReport } from '../../../shared/occasionalReports/types';
import { sharedCreateOccasionalMaintenanceReport } from '../../../shared/occasionalReports/sharedCreateOccasionalMaintenanceReport';

const buildingServices = new BuildingServices();

export async function createOccasionalReport(req: Request, res: Response) {
  const { buildingId }: ICreateOccasionalMaintenanceReport = req.body;

  const building = await buildingServices.findByNanoId({ buildingNanoId: buildingId });

  const maintenance = await sharedCreateOccasionalMaintenanceReport({
    body: {
      ...req.body,
      buildingId: building.id,
    },
    companyId: building.companyId,
  });

  return res.status(200).json({
    maintenance: {
      id: maintenance.id,
    },
    ServerMessage: {
      statusCode: 200,
      message: `Manutenção reportada com sucesso.`,
    },
  });
}
