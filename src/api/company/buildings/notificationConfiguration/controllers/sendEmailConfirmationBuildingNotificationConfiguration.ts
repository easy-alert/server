// #region IMPORTS
import { Request, Response } from 'express';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { TokenServices } from '../../../../../utils/token/tokenServices';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';
import { BuildingServices } from '../../building/services/buildingServices';

const validator = new Validator();
const tokenServices = new TokenServices();

const buildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();
const buildingServices = new BuildingServices();

// #endregion

export async function sendEmailConfirmationBuildingNotificationConfiguration(
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

  // if (!notificationData?.isMain) {
  //   throw new ServerMessage({
  //     statusCode: 400,
  //     message: 'O usuário não está configurado como principal para receber notificações.',
  //   });
  // }
  if (!notificationData?.email) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'O usuário não possui um email configurado para receber notificações.',
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
      confirmType: 'email',
    },
  });

  await tokenServices.saveInDatabase({ token });

  const building = await buildingServices.findById({ buildingId: notificationData.buildingId });

  await buildingNotificationConfigurationServices.sendEmailConfirmForReceiveNotifications({
    buildingNotificationConfigurationId: notificationData.id,
    companyLogo: building.Company.image,
    link: `${link}?token=${token}`,
    toEmail: notificationData.email,
  });

  // #endregion

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Confirmação de E-mail enviada com sucesso.`,
    },
  });
}
