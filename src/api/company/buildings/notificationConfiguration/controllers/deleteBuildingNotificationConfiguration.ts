// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';

const validator = new Validator();
const buildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

// #endregion

export async function deleteBuildingNotificationConfiguration(req: Request, res: Response) {
  const { buildingNotificationConfigurationId } = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'ID da configuração da edificação ',
      type: 'string',
      variable: buildingNotificationConfigurationId,
    },
  ]);

  await buildingNotificationConfigurationServices.findById({
    buildingNotificationConfigurationId,
  });

  // #endregion

  await buildingNotificationConfigurationServices.delete({
    buildingNotificationConfigurationId,
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Configuração de notificação excluída com sucesso.`,
    },
  });
}
