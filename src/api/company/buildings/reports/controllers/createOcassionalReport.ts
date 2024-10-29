// #region IMPORTS
import { Request, Response } from 'express';
import { sharedCreateOccasionalMaintenanceReport } from '../../../../shared/occasionalReports/sharedCreateOccasionalMaintenanceReport';

export async function createOccasionalReport(req: Request, res: Response) {
  const maintenance = await sharedCreateOccasionalMaintenanceReport({
    body: req.body,
    companyId: req.Company.id,
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
