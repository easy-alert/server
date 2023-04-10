// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';

const validator = new Validator();
const buildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

// #endregion

export async function changeShowContactStatus(req: Request, res: Response) {
  const { buildingNotificationConfigurationId, showContact } = req.body;

  validator.check([
    {
      label: 'ID da configuração de notificação',
      type: 'string',
      variable: buildingNotificationConfigurationId,
    },
    {
      label: 'Status de exibição',
      type: 'boolean',
      variable: showContact,
    },
  ]);

  await buildingNotificationConfigurationServices.findById({
    buildingNotificationConfigurationId,
  });

  await buildingNotificationConfigurationServices.changeShowContactStatus({
    buildingNotificationConfigurationId,
    showContact,
  });

  return res.sendStatus(200);
}
