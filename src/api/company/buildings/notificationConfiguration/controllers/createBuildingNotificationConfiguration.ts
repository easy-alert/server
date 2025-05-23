// #region IMPORTS
import { Request, Response } from 'express';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { TokenServices } from '../../../../../utils/token/tokenServices';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';
import { BuildingServices } from '../../building/services/buildingServices';

const validator = new Validator();
const buildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();
const tokenServices = new TokenServices();
const buildingServices = new BuildingServices();

// #endregion

export async function createBuildingNotificationConfiguration(req: Request, res: Response) {
  const { linkEmail, linkPhone } = req.body;

  let { data } = req.body;

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
      isOptional: true,
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
      isOptional: true,
    },
    {
      label: 'Contato Principal',
      type: 'boolean',
      variable: data.isMain,
      isOptional: true,
    },
    {
      label: 'Mostrar contato',
      type: 'boolean',
      variable: data.showContact,
      isOptional: true,
    },
  ]);

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

  if (data.email) {
    data = {
      ...data,
      email: data.email.toLowerCase(),
    };
    // TASK SA-4708 PERMITIU EMAILS REPETIDOS
    // await buildingNotificationConfigurationServices.findByEmail({
    //   email: data.email,
    //   buildingId: data.buildingId,
    // });
  }

  // #region CHECK CONTACT NUMBER
  // TASK SA-4708 PERMITIU TELEFONES REPETIDOS
  // if (data.contactNumber) {
  //   await buildingNotificationConfigurationServices.findByContactNumber({
  //     contactNumber: data.contactNumber,
  //     buildingId: data.buildingId,
  //   });
  // }

  if (data.email === null && data.contactNumber === null) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'E-mail ou WhatsApp obrigatório.',
    });
  }

  // #endregion

  const buildingNotificationConfigurationData =
    await buildingNotificationConfigurationServices.create({ data });

  // #region SEND MESSAGE

  // Todos os sindicos vao ter que validar pra poder listar o select de building no kanban
  // SA-6889
  // if (buildingNotificationConfigurationData.isMain) {
  if (buildingNotificationConfigurationData.contactNumber) {
    const token = tokenServices.generate({
      tokenData: {
        id: buildingNotificationConfigurationData.id,
        confirmType: 'whatsapp',
      },
    });

    const createdToken = await tokenServices.saveInDatabase({ token });

    await buildingNotificationConfigurationServices.sendWhatsappConfirmationForReceiveNotifications(
      {
        buildingNotificationConfigurationId: buildingNotificationConfigurationData.id,
        receiverPhoneNumber: buildingNotificationConfigurationData.contactNumber,
        link: `${linkPhone}?tokenId=${createdToken.id}`,
      },
    );
  }
  // }

  if (buildingNotificationConfigurationData.email) {
    const token = tokenServices.generate({
      tokenData: {
        id: buildingNotificationConfigurationData.id,
        confirmType: 'email',
      },
    });

    await tokenServices.saveInDatabase({ token });

    const building = await buildingServices.findById({ buildingId: data.buildingId });

    await buildingNotificationConfigurationServices.sendEmailConfirmForReceiveNotifications({
      buildingNotificationConfigurationId: buildingNotificationConfigurationData.id,
      link: `${linkEmail}?token=${token}`,
      companyLogo: building.Company.image,
      toEmail: buildingNotificationConfigurationData.email,
    });
  }
  // #endregion

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: `Usuário para notificação cadastrado com sucesso.`,
    },
  });
}
