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

export async function editBuildingNotificationConfiguration(req: Request, res: Response) {
  const { buildingNotificationConfigurationId, buildingId, linkEmail, linkPhone } = req.body;

  let { data } = req.body;

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

  const buildingNotificationConfigurationData =
    await buildingNotificationConfigurationServices.findById({
      buildingNotificationConfigurationId,
    });

  // #region CHECK EMAIL
  // TASK SA-4708 PERMITIU EMAILS REPETIDOS
  // await buildingNotificationConfigurationServices.findByEmailForEdit({
  //   email: data.email,
  //   buildingId,
  //   buildingNotificationConfigurationId,
  // });

  if (data.email !== buildingNotificationConfigurationData?.email) {
    data = {
      ...data,
      emailIsConfirmed: false,
    };
  }

  if (data.email) {
    data = {
      ...data,
      email: data.email.toLowerCase(),
    };
  }

  // #endregion

  // #region CHECK CONTACT NUMBER
  // TASK SA-4708 PERMITIU TELEFONES REPETIDOS
  // await buildingNotificationConfigurationServices.findByContactNumberForEdit({
  //   contactNumber: data.contactNumber,
  //   buildingId,
  //   buildingNotificationConfigurationId,
  // });

  if (data.contactNumber !== buildingNotificationConfigurationData?.contactNumber) {
    data = {
      ...data,
      contactNumberIsConfirmed: false,
    };
  }
  // #endregion

  const userMainForNotification =
    await buildingNotificationConfigurationServices.findNotificationConfigurationMainForEdit({
      buildingId,
      buildingNotificationConfigurationId,
    });

  if (userMainForNotification && data.isMain) {
    throw new ServerMessage({
      message:
        'A informação: Usuário principal para receber notificação já existe na base de dados.',
      statusCode: 400,
    });
  }

  // #region AWAIT 5 MINUTES FOR SEND OTHER NOTIFICATION
  if (
    buildingNotificationConfigurationData?.contactNumber !== data.contactNumber ||
    buildingNotificationConfigurationData?.email !== data.email
  ) {
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
    // #endregion
  }

  if (data.email === null && data.contactNumber === null) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'E-mail ou WhatsApp obrigatório.',
    });
  }

  // #endregion

  const buildingNotificationConfigurationEditedData =
    await buildingNotificationConfigurationServices.edit({
      buildingNotificationConfigurationId,
      data,
    });

  // #region SEND MESSAGE
  // Todos os sindicos vao ter que validar pra poder listar o select de building no kanban
  // SA-6889
  // if (buildingNotificationConfigurationEditedData.isMain) {
  if (
    buildingNotificationConfigurationEditedData.contactNumber &&
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

      const createdToken = await tokenServices.saveInDatabase({ token });

      await buildingNotificationConfigurationServices.sendWhatsappConfirmationForReceiveNotifications(
        {
          buildingNotificationConfigurationId,
          receiverPhoneNumber: buildingNotificationConfigurationEditedData.contactNumber,
          link: `${linkPhone}?tokenId=${createdToken.id}`,
        },
      );
    }
    // }
  }

  // EMAIL

  if (
    buildingNotificationConfigurationEditedData.email &&
    !buildingNotificationConfigurationEditedData.emailIsConfirmed
  ) {
    if (
      buildingNotificationConfigurationEditedData.email !==
      buildingNotificationConfigurationData?.email
    ) {
      const token = tokenServices.generate({
        tokenData: {
          id: buildingNotificationConfigurationEditedData.id,
          confirmType: 'email',
        },
      });

      await tokenServices.saveInDatabase({ token });

      const building = await buildingServices.findById({ buildingId });

      await buildingNotificationConfigurationServices.sendEmailConfirmForReceiveNotifications({
        buildingNotificationConfigurationId: buildingNotificationConfigurationEditedData.id,
        companyLogo: building.Company.image,
        link: `${linkEmail}?token=${token}`,
        toEmail: buildingNotificationConfigurationEditedData.email,
      });
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
