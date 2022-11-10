// #region IMPORTS
import { Request, Response } from 'express';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingNotificationConfigurationServices } from '../services/buildingNotificationConfigurationServices';

const validator = new Validator();
const buildingNotificationConfigurationServices =
  new BuildingNotificationConfigurationServices();

// #endregion

export async function sendWhatappConfirmationBuildingNotificationConfiguration(
  req: Request,
  res: Response,
) {
  const { buildingNotificationConfigurationId } = req.body;

  validator.check([
    {
      label: 'ID da configuração da edificação ',
      type: 'string',
      variable: buildingNotificationConfigurationId,
    },
  ]);

  const notification = await buildingNotificationConfigurationServices.findById(
    {
      buildingNotificationConfigurationId,
    },
  );

  if (!notification?.isMain) {
    throw new ServerMessage({
      statusCode: 400,
      message:
        'O usuário não esta configurado como principal para receber notificações.',
    });
  }

  // const notificationStatus =
  //   await buildingNotificationConfigurationServices.sendWhatsappConfirmationForReceiveNotifications(
  //     { receiverPhoneNumber: '5548996223154', link: 'LINK.COM' },
  //   );

  return res.status(200).json({
    notification,
    ServerMessage: {
      statusCode: 201,
      message: `Usuário para notificação cadastrado com sucesso.`,
    },
  });
}
