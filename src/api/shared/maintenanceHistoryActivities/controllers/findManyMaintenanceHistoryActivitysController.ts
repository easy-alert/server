import { Response, Request } from 'express';
import { findManyMaintenanceHistoryActivitysService } from '../services';
import { checkValues } from '../../../../utils/newValidator';

export async function findManyMaintenanceHistoryActivitysController(req: Request, res: Response) {
  const { maintenanceHistoryId } = req.params as any as { maintenanceHistoryId: string };

  checkValues([
    { label: 'ID do histórico de manutenção', type: 'string', value: maintenanceHistoryId },
  ]);

  const { maintenanceHistoryActivities } = await findManyMaintenanceHistoryActivitysService(
    maintenanceHistoryId,
  );

  return res.status(200).json({ maintenanceHistoryActivities });
}
