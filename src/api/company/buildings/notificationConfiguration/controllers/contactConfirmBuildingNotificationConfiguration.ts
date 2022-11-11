// #region IMPORTS
import { Request, Response } from 'express';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
// import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { TokenServices } from '../../../../../utils/token/tokenServices';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingNotificationConfigurationServices } from '../services/buildingNotificationConfigurationServices';
import { ITokenConfirm } from './types';

const validator = new Validator();
const tokenServices = new TokenServices();

const buildingNotificationConfigurationServices = new BuildingNotificationConfigurationServices();

// #endregion

export async function contactConfirmBuildingNotificationConfiguration(req: Request, res: Response) {
  const { token } = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'Token',
      type: 'string',
      variable: token,
    },
  ]);

  await tokenServices.find({ token });

  const { id: buildingNotificationConfigurationId, confirmType } = tokenServices.decode({
    token,
  }) as ITokenConfirm;

  await buildingNotificationConfigurationServices.findById({
    buildingNotificationConfigurationId,
  });

  // #endregion

  switch (confirmType) {
    case 'whatsapp':
      await buildingNotificationConfigurationServices.confirmContactNumber({
        buildingNotificationConfigurationId,
      });

      await tokenServices.markAsUsed({ token });

      return res.status(200).json({
        ServerMessage: {
          statusCode: 200,
          message: `Whatsapp confirmado com sucesso.`,
        },
      });

    default:
      throw new ServerMessage({
        statusCode: 400,
        message: 'Tipo do Token inválido',
      });
  }
}
