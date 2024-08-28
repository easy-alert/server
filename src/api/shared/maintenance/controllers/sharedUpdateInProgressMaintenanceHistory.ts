// CLASS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../services/sharedMaintenanceServices';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { createMaintenanceHistoryActivityCommentService } from '../../maintenanceHistoryActivities/services';

const sharedMaintenanceServices = new SharedMaintenanceServices();
const validator = new Validator();

export async function sharedUpdateInProgressMaintenanceHistory(req: Request, res: Response) {
  const { maintenanceHistoryId, inProgressChange } = req.body;
  const { syndicNanoId } = req.query as any as { syndicNanoId: string };

  validator.check([
    { label: 'ID da manutenção', variable: maintenanceHistoryId, type: 'string' },
    { label: 'Status da execução', variable: inProgressChange, type: 'boolean' },
  ]);

  const maintenanceHistory = await sharedMaintenanceServices.findHistoryById({
    maintenanceHistoryId,
  });

  if (
    maintenanceHistory.MaintenancesStatus.name === 'completed' ||
    maintenanceHistory.MaintenancesStatus.name === 'overdue'
  ) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Essa manutenção já foi concluída.',
    });
  }

  await sharedMaintenanceServices.updateMaintenanceHistory({
    data: { inProgress: inProgressChange },
    maintenanceHistoryId,
  });

  await createMaintenanceHistoryActivityCommentService({
    userId: req.userId,
    syndicNanoId,
    maintenanceHistoryId,
    content: inProgressChange
      ? 'Manutenção colocada em execução.'
      : 'Manutenção removida da execução.',
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Execução alterada com sucesso.`,
    },
  });
}
