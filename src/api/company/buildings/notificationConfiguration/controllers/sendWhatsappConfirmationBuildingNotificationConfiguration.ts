// #region IMPORTS
import { Request, Response } from 'express';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { TokenServices } from '../../../../../utils/token/tokenServices';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingNotificationConfigurationServices } from '../services/buildingNotificationConfigurationServices';

const validator = new Validator();
const tokenServices = new TokenServices();

const buildingNotificationConfigurationServices = new BuildingNotificationConfigurationServices();

// #endregion

export async function sendWhatsappConfirmationBuildingNotificationConfiguration(
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

  const notificationData = await buildingNotificationConfigurationServices.findById({
    buildingNotificationConfigurationId,
  });

  if (!notificationData?.isMain) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'O usuário não esta configurado como principal para receber notificações.',
    });
  }

  // #region AWAIT 5 MINUTES FOR SEND OTHER NOTIFICATION

  const actualHoursInMs = new Date().getTime();
  const notificationHoursInMs = new Date(notificationData.lastNotificationDate).getTime();

  const dateDiference = (actualHoursInMs - notificationHoursInMs) / 60000;

  if (dateDiference <= 5) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Aguarde ao menos 5 minutos para reenviar uma notificação de confirmação.',
    });
  }
  // #endregion

  // #endregion

  // #region TOKEN
  const token = tokenServices.generate({
    tokenData: {
      id: buildingNotificationConfigurationId,
      confirmType: 'whatsapp',
    },
  });

  await tokenServices.saveInDatabase({ token });
  // #endregion

  // #region SEND MESSAGE

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
