// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingTypeServices } from '../../buildingsTypes/services/buildingTypeServices';
import { BuildingServices } from '../services/buildingServices';

const validator = new Validator();
const buildingServices = new BuildingServices();
const buildingTypeServices = new BuildingTypeServices();

// #endregion

export async function editBuilding(req: Request, res: Response) {
  const { buildingId, data } = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
    {
      label: 'ID do tipo da edificação',
      type: 'string',
      variable: data.buildingTypeId,
    },
    {
      label: 'nome',
      type: 'string',
      variable: data.name,
    },
    {
      label: 'CEP',
      type: 'string',
      variable: data.cep,
      isOptional: true,
    },
    {
      label: 'Cidade',
      type: 'string',
      variable: data.city,
      isOptional: true,
    },
    {
      label: 'Estado',
      type: 'string',
      variable: data.state,
      isOptional: true,
    },
    {
      label: 'Bairro',
      type: 'string',
      variable: data.neighborhood,
      isOptional: true,
    },
    {
      label: 'Nome da rua',
      type: 'string',
      variable: data.streetName,
      isOptional: true,
    },
    {
      label: 'Nome da rua',
      type: 'string',
      variable: data.streetName,
      isOptional: true,
    },
    {
      label: 'Área',
      type: 'string',
      variable: data.area,
      isOptional: true,
    },
    {
      label: 'Data de entrega',
      type: 'string',
      variable: data.deliveryDate,
    },
    {
      label: 'Término da garantia',
      type: 'string',
      variable: data.warrantyExpiration,
    },
    {
      label: 'Notificar após termino da garantia',
      type: 'boolean',
      variable: data.keepNotificationAfterWarrantyEnds,
    },
  ]);

  await buildingTypeServices.findById({ buildingTypeId: data.buildingTypeId });

  await buildingServices.findById({ buildingId });

  await buildingServices.findByForEditName({ name: data.name, buildingId });

  // #endregion

  await buildingServices.edit({ data, buildingId });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: `Edificação editada com sucesso.`,
    },
  });
}
