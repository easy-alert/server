// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { NextMaintenanceCreationBasis } from '@prisma/client';
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingTypeServices } from '../../buildingsTypes/services/buildingTypeServices';
import { BuildingServices } from '../services/buildingServices';
import { checkEnums } from '../../../../../utils/newValidator';

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
    },
    {
      label: 'Cidade',
      type: 'string',
      variable: data.city,
    },
    {
      label: 'Estado',
      type: 'string',
      variable: data.state,
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
      label: 'Término da garantia',
      type: 'string',
      variable: data.warrantyExpiration,
    },
    {
      label: 'Notificar após termino da garantia',
      type: 'boolean',
      variable: data.keepNotificationAfterWarrantyEnds,
    },
    {
      label: 'Comprovação de relato',
      type: 'boolean',
      variable: data.mandatoryReportProof,
    },
    {
      label: 'Convidado pode concluir manutenção',
      type: 'boolean',
      variable: data.guestCanCompleteMaintenance,
    },
    {
      label: 'Próxima manutenção baseada em',
      type: 'string',
      variable: data.nextMaintenanceCreationBasis,
    },
  ]);

  checkEnums([
    {
      enumType: NextMaintenanceCreationBasis,
      label: 'Tipo da criação da próxima manutenção',
      value: data.nextMaintenanceCreationBasis,
    },
  ]);

  await buildingTypeServices.findById({ buildingTypeId: data.buildingTypeId });

  await buildingServices.findById({ buildingId });

  // #endregion

  await buildingServices.edit({ data, buildingId });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: `Edificação editada com sucesso.`,
    },
  });
}
