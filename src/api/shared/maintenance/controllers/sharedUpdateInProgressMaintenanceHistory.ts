// CLASS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../services/sharedMaintenanceServices';

const sharedMaintenanceServices = new SharedMaintenanceServices();
const validator = new Validator();

export async function sharedUpdateInProgressMaintenanceHistory(req: Request, res: Response) {
  const { maintenanceHistoryId, inProgressChange } = req.body;

  validator.check([
    { label: 'ID da manutenção', variable: maintenanceHistoryId, type: 'string' },
    { label: 'Status da execução', variable: inProgressChange, type: 'boolean' },
  ]);

  await sharedMaintenanceServices.updateMaintenanceHistory({
    data: { inProgress: inProgressChange },
    maintenanceHistoryId,
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Execução alterada com sucesso.`,
    },
  });
}
