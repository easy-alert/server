// #region IMPORTS
import { Request, Response } from 'express';
import { TokenServices } from '../../../../../utils/token/tokenServices';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingNotificationConfigurationServices } from '../services/buildingNotificationConfigurationServices';

const validator = new Validator();
const buildingNotificationConfigurationServices = new BuildingNotificationConfigurationServices();
const tokenServices = new TokenServices();

// #endregion

export async function createBuildingNotificationConfiguration(req: Request, res: Response) {
  const { link } = req.body;

  let { data } = req.body;

  data = {
    ...data,
    email: data.email.toLowerCase(),
  };

  // #region VALIDATIONS
  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: data.buildingId,
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

  await buildingNotificationConfigurationServices.findByEmail({
    email: data.email,
    buildingId: data.buildingId,
  });

  await buildingNotificationConfigurationServices.findByContactNumber({
    contactNumber: data.contactNumber,
    buildingId: data.buildingId,
  });

  if (data.isMain) {
    const userMainForNotification =
      await buildingNotificationConfigurationServices.findNotificationConfigurationMainForCreate({
        buildingId: data.buildingId,
      });

    validator.cannotExists([
      {
        label: 'Usuário principal',
        variable: userMainForNotification,
      },
    ]);
  }

  // #endregion

  const buildingNotificationConfigurationData =
    await buildingNotificationConfigurationServices.create({ data });

  // #region SEND MESSAGE

  if (buildingNotificationConfigurationData.isMain) {
    const token = tokenServices.generate({
      tokenData: {
        id: buildingNotificationConfigurationData.id,
        confirmType: 'whatsapp',
      },
    });

    await tokenServices.saveInDatabase({ token });

    await buildingNotificationConfigurationServices.sendWhatsappConfirmationForReceiveNotifications(
      {
        buildingNotificationConfigurationId: buildingNotificationConfigurationData.id,
        receiverPhoneNumber: buildingNotificationConfigurationData.contactNumber,
        link: `${link}?token=${token}`,
      },
    );

    // #endregion
  }
  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: `Usuário para notificação cadastrado com sucesso.`,
    },
  });
}
