import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { ClientBuildingServices } from '../services/clientBuildingServices';
import { SharedBuildingNotificationConfigurationServices } from '../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';

const clientBuildingServices = new ClientBuildingServices();

const validator = new Validator();
const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

export async function findSettingsData(req: Request, res: Response) {
  const { buildingNanoId, syndicNanoId } = req.params;

  validator.check([
    {
      label: 'Id do síndico',
      type: 'string',
      variable: syndicNanoId,
    },
  ]);

  await sharedBuildingNotificationConfigurationServices.findByNanoId({
    syndicNanoId,
  });

  validator.check([{ label: 'Id da edificaçao', type: 'string', variable: buildingNanoId }]);

  const settingsData = await clientBuildingServices.findSettingsData({
    buildingNanoId,
  });

  const formattedSettingsData = {
    ...settingsData,
    Folders:
      Number(settingsData?.BuildingFolders?.length) > 0
        ? settingsData?.BuildingFolders[0].BuildingFolder
        : null,
  };

  return res.status(200).json(formattedSettingsData);
}
