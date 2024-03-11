import { Response, Request } from 'express';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';
import { checkValues } from '../../../../../utils/newValidator';

const buildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

export async function listSyndicsForSelect(req: Request, res: Response) {
  const { buildingId } = req.params as any as { buildingId: string };

  checkValues([{ label: 'ID da edificação', type: 'string', value: buildingId }]);

  const syndics = await buildingNotificationConfigurationServices.findByBuildingId(buildingId);

  return res.status(200).json({ syndics });
}
