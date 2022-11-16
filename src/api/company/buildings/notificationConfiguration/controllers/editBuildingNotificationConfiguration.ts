// #region IMPORTS
import { Request, Response } from 'express';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { TokenServices } from '../../../../../utils/token/tokenServices';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingNotificationConfigurationServices } from '../services/buildingNotificationConfigurationServices';

const validator = new Validator();
const buildingNotificationConfigurationServices = new BuildingNotificationConfigurationServices();
const tokenServices = new TokenServices();

// #endregion

export async function editBuildingNotificationConfiguration(req: Request, res: Response) {
  const { buildingNotificationConfigurationId, buildingId, link } = req.body;

  let { data } = req.body;

  data = {
    ...data,
    email: data.email.toLowerCase(),
  };

  // #region VALIDATIONS
  validator.check([
    {
      label: 'ID da configuração de notificação',
      type: 'string',
      variable: buildingNotificationConfigurationId,
    },
    {
      label: 'ID da Edificação',
      type: 'string',
      variable: buildingId,
    },
    {
      label: 'Nome',
      type: 'string',
      variable: data.name,
    },
    {
      label: 'E-mail',
      type: 'string',
      variable: data.email,
    },
    {
      label: 'Função',
      type: 'string',
      variable: data.role,
    },
    {
      label: 'Número de telefone',
      type: 'string',
      variable: data.contactNumber,
    },
    {
      label: 'Número de telefone Principal',
      type: 'boolean',
      variable: data.isMain,
      isOptional: true,
    },
  ]);

  const buildingNotificationConfigurationData =
    await buildingNotificationConfigurationServices.findById({
      buildingNotificationConfigurationId,
    });

  await buildingNotificationConfigurationServices.findByEmailForEdit({
    email: data.email,
    buildingId,
    buildingNotificationConfigurationId,
  });

  await buildingNotificationConfigurationServices.findByContactNumberForEdit({
    contactNumber: data.contactNumber,
    buildingId,
    buildingNotificationConfigurationId,
  });

  if (data.contactNumber !== buildingNotificationConfigurationData?.contactNumber) {
    data = {
      ...data,
      contactNumberIsConfirmed: false,
    };
  }

  if (data.isMain) {
    const userMainForNotification =
      await buildingNotificationConfigurationServices.findNotificationConfigurationMainForEdit({
        buildingId,
        buildingNotificationConfigurationId,
      });

    validator.cannotExists([
      {
        label: 'Usuário principal para receber notificação',
        variable: userMainForNotification,
      },
    ]);

    // #region AWAIT 5 MINUTES FOR SEND OTHER NOTIFICATION
    if (buildingNotificationConfigurationData?.contactNumber !== data.contactNumber) {
      const actualHoursInMs = new Date().getTime();
      const notificationHoursInMs = new Date(
        buildingNotificationConfigurationData!.lastNotificationDate,
      ).getTime();

      const dateDiference = (actualHoursInMs - notificationHoursInMs) / 60000;

      if (dateDiference <= 5) {
        throw new ServerMessage({
          statusCode: 400,
          message: 'Aguarde ao menos 5 minutos para reenviar a confirmação.',
        });
      }
    }
    // #endregion
  }

  // #endregion

  const buildingNotificationConfigurationEditedData =
    await buildingNotificationConfigurationServices.edit({
      buildingNotificationConfigurationId,
      data,
    });

  // #region SEND MESSAGE

  if (
    buildingNotificationConfigurationEditedData.isMain &&
    !buildingNotificationConfigurationEditedData.contactNumberIsConfirmed
  ) {
    if (
      buildingNotificationConfigurationEditedData.contactNumber !==
        buildingNotificationConfigurationData?.contactNumber ||
      (!buildingNotificationConfigurationData?.isMain &&
        buildingNotificationConfigurationEditedData.isMain)
    ) {
      const token = tokenServices.generate({
        tokenData: {
          id: buildingNotificationConfigurationId,
          confirmType: 'whatsapp',
        },
      });

      await tokenServices.saveInDatabase({ token });

      await buildingNotificationConfigurationServices.sendWhatsappConfirmationForReceiveNotifications(
        {
          buildingNotificationConfigurationId,
          receiverPhoneNumber: buildingNotificationConfigurationEditedData.contactNumber,
          link: `${link}?token=${token}`,
        },
      );
    }
  }
  // #endregion

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Usuário para notificação editado com sucesso.`,
    },
  });
}
