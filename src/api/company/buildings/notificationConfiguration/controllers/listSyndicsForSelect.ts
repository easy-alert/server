import { Response, Request } from 'express';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';
import { checkValues } from '../../../../../utils/newValidator';

const buildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

export async function listSyndicsForSelect(req: Request, res: Response) {
  const { buildingNanoId } = req.params as any as { buildingNanoId: string };

  checkValues([{ label: 'ID da edificação', type: 'string', value: buildingNanoId }]);

  const syndics = await buildingNotificationConfigurationServices.findByBuildingNanoId(
    buildingNanoId,
  );

  return res.status(200).json({ syndics });
}
