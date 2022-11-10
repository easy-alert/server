// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingNotificationConfigurationServices } from '../services/buildingNotificationConfigurationServices';

const validator = new Validator();
const buildingNotificationConfigurationServices =
  new BuildingNotificationConfigurationServices();

// #endregion

export async function editBuildingNotificationConfiguration(
  req: Request,
  res: Response,
) {
  const { buildingNotificationConfigurationId, buildingId, data } = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'ID da configuração de notificação',
      type: 'string',
      variable: buildingNotificationConfigurationId,
    },
    {
      label: 'ID da edificação',
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

  await buildingNotificationConfigurationServices.findByEmailForEdit({
    email: data.email,
    buildingId: data.buildingId,
    buildingNotificationConfigurationId,
  });

  await buildingNotificationConfigurationServices.findByContactNumberForEdit({
    contactNumber: data.contactNumber,
    buildingId: data.buildingId,
    buildingNotificationConfigurationId,
  });

  if (data.isMain) {
    const userMainForNotification =
      await buildingNotificationConfigurationServices.findNotificationConfigurationMainForEdit(
        { buildingId, buildingNotificationConfigurationId },
      );

    validator.cannotExists([
      {
        label: 'Usuário principal para receber notificação',
        variable: userMainForNotification,
      },
    ]);
  }
  // #endregion

  // await buildingNotificationConfigurationServices.create({ data });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Usuário para notificação editado com sucesso.`,
    },
  });
}
