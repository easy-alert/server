// #region IMPORTS
import { Request, Response } from 'express';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { TokenServices } from '../../../../../utils/token/tokenServices';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';

const validator = new Validator();
const tokenServices = new TokenServices();

const buildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

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
  if (!notificationData?.contactNumber) {
    throw new ServerMessage({
      statusCode: 400,
      message:
        'O usuário não possui um telefone configurado como principal para receber notificações.',
    });
  }

  // #region AWAIT 5 MINUTES FOR SEND OTHER NOTIFICATION

  const actualHoursInMs = new Date().getTime();
  const notificationHoursInMs = new Date(notificationData.lastNotificationDate).getTime();

  const dateDiference = (actualHoursInMs - notificationHoursInMs) / 60000;

  if (dateDiference <= 5) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Aguarde ao menos 5 minutos para reenviar a confirmação.',
    });
  }
  // #endregion

  // #endregion

  // #region SEND MESSAGE
  const token = tokenServices.generate({
    tokenData: {
      id: buildingNotificationConfigurationId,
      confirmType: 'whatsapp',
    },
  });

  const createdToken = await tokenServices.saveInDatabase({ token });

  await buildingNotificationConfigurationServices.sendWhatsappConfirmationForReceiveNotifications({
    buildingNotificationConfigurationId,
    receiverPhoneNumber: notificationData.contactNumber,
    link: `${link}?tokenId=${createdToken.id}`,
  });

  // #endregion

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Confirmação de WhatsApp enviada com sucesso.`,
    },
  });
}
