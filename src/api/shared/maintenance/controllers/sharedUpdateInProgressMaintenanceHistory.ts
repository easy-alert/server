// CLASS
import { Request, Response } from 'express';

import { SharedMaintenanceServices } from '../services/sharedMaintenanceServices';

import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { createMaintenanceHistoryActivityCommentService } from '../../maintenanceHistoryActivities/services';
import { checkValues } from '../../../../utils/newValidator';

const sharedMaintenanceServices = new SharedMaintenanceServices();

export async function sharedUpdateInProgressMaintenanceHistory(req: Request, res: Response) {
  const { userId, syndicNanoId, maintenanceHistoryId, inProgressChange } = req.body;

  checkValues([
    { label: 'ID da manutenção', value: maintenanceHistoryId, type: 'string' },
    { label: 'Status da execução', value: inProgressChange, type: 'boolean' },
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
    userId,
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
