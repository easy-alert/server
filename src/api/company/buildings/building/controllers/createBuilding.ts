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

export async function createBuilding(req: Request, res: Response) {
  const {
    buildingTypeId,
    name,
    cep,
    city,
    state,
    neighborhood,
    streetName,
    area,
    deliveryDate,
    warrantyExpiration,
    keepNotificationAfterWarrantyEnds,
  } = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'ID do tipo da edificação',
      type: 'string',
      variable: buildingTypeId,
    },
    {
      label: 'nome',
      type: 'string',
      variable: name,
    },
    {
      label: 'CEP',
      type: 'string',
      variable: cep,
      isOptional: true,
    },
    {
      label: 'Cidade',
      type: 'string',
      variable: city,
      isOptional: true,
    },
    {
      label: 'Estado',
      type: 'string',
      variable: state,
      isOptional: true,
    },
    {
      label: 'Bairro',
      type: 'string',
      variable: neighborhood,
      isOptional: true,
    },
    {
      label: 'Nome da rua',
      type: 'string',
      variable: streetName,
      isOptional: true,
    },
    {
      label: 'Nome da rua',
      type: 'string',
      variable: streetName,
      isOptional: true,
    },
    {
      label: 'Área',
      type: 'string',
      variable: area,
      isOptional: true,
    },
    {
      label: 'Data de entrega',
      type: 'string',
      variable: deliveryDate,
    },
    {
      label: 'Término da garantia',
      type: 'string',
      variable: warrantyExpiration,
    },
    {
      label: 'Notificar após termino da garantia',
      type: 'boolean',
      variable: keepNotificationAfterWarrantyEnds,
    },
  ]);

  await buildingTypeServices.findById({ buildingTypeId });

  // #endregion

  await buildingServices.create({ data: req.body });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Edificação cadastrada com sucesso.`,
    },
  });
}
