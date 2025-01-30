import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { SharedBuildingNotificationConfigurationServices } from '../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';

const validator = new Validator();
const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();
const buildingServices = new BuildingServices();

export async function findSyndicsByBuildingNanoId(req: Request, res: Response) {
  const { buildingNanoId } = req.params;

  validator.check([{ label: 'Id da edificação', type: 'string', variable: buildingNanoId }]);

  await buildingServices.findByNanoId({ buildingNanoId });

  const syndics = await sharedBuildingNotificationConfigurationServices.findByBuildingNanoId(
    buildingNanoId,
  );

  return res.status(200).json(syndics);
}
