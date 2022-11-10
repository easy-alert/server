// #region IMPORTS
import { Request, Response } from 'express';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { HandlerToken } from '../../../../../utils/token/handlerToken';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingNotificationConfigurationServices } from '../services/buildingNotificationConfigurationServices';

const validator = new Validator();
const handlerToken = new HandlerToken();

const buildingNotificationConfigurationServices =
  new BuildingNotificationConfigurationServices();

// #endregion

export async function sendWhatappConfirmationBuildingNotificationConfiguration(
  req: Request,
  res: Response,
) {
  const { buildingNotificationConfigurationId, link } = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'ID da configuração da edificação ',
      type: 'string',
      variable: buildingNotificationConfigurationId,
    },
    {
      label: 'Link ',
      type: 'string',
      variable: link,
    },
  ]);

  const notificationData =
    await buildingNotificationConfigurationServices.findById({
      buildingNotificationConfigurationId,
    });

  if (!notificationData?.isMain) {
    throw new ServerMessage({
      statusCode: 400,
      message:
        'O usuário não esta configurado como principal para receber notificações.',
    });
  }
  // #endregion

  // #region TOKEN
  const token = handlerToken.generateToken({
    tokenData: {
      id: BuildingNotificationConfigurationServices,
      type: 'whatsapp',
    },
  });

  await handlerToken.saveTokenInDatabase({ token });
  // #endregion

  // #region Send Message

  // const notificationStatus =
  //   await buildingNotificationConfigurationServices.sendWhatsappConfirmationForReceiveNotifications(
  //     {
  //       receiverPhoneNumber: notificationData.contactNumber,
  //       link: `${link}/${token}`,
  //     },
  //   );
  // console.log(notificationStatus);

  // #endregion

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Notificação para confirmar telefone enviada com sucesso.`,
    },
  });
}
