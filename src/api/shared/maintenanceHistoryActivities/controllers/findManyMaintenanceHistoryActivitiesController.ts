import { Response, Request } from 'express';
import { findManyMaintenanceHistoryActivitiesService } from '../services';
import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

export async function findManyMaintenanceHistoryActivitiesController(req: Request, res: Response) {
  const { maintenanceHistoryId } = req.params as any as { maintenanceHistoryId: string };
  const { syndicNanoId } = req.query as any as { syndicNanoId: string };

  checkValues([
    { label: 'ID do histórico de manutenção', type: 'string', value: maintenanceHistoryId },
  ]);

  const { isActivityLogPublic } = await buildingServices.findByMaintenanceHistoryId({
    maintenanceHistoryId,
  });

  if (!syndicNanoId && !isActivityLogPublic) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Você não tem permissão para acessar as atividades.`,
    });
  }

  const { maintenanceHistoryActivities } = await findManyMaintenanceHistoryActivitiesService(
    maintenanceHistoryId,
  );

  return res.status(200).json({ maintenanceHistoryActivities });
}
