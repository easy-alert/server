// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingNotificationConfigurationServices } from '../services/buildingNotificationConfigurationServices';

const validator = new Validator();
const buildingNotificationConfigurationServices =
  new BuildingNotificationConfigurationServices();

// #endregion

export async function createBuildingNotificationConfiguration(
  req: Request,
  res: Response,
) {
  const data = req.body;

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
      variable: data.role,
    },
    {
      label: 'Número de telefone Principal',
      type: 'string',
      variable: data.role,
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

  // #endregion

  await buildingNotificationConfigurationServices.create({ data });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: `Usuário para notificação cadastrado com sucesso.`,
    },
  });
}
