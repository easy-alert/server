// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { NextMaintenanceCreationBasis } from '@prisma/client';
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingTypeServices } from '../../buildingsTypes/services/buildingTypeServices';
import { BuildingServices } from '../services/buildingServices';
import { EmailTransporterServices } from '../../../../../utils/emailTransporter/emailTransporterServices';
import { checkEnums } from '../../../../../utils/newValidator';

const validator = new Validator();
const buildingServices = new BuildingServices();
const buildingTypeServices = new BuildingTypeServices();
const emailTransporter = new EmailTransporterServices();

// #endregion

export async function createBuilding(req: Request, res: Response) {
  const data = {
    ...req.body,
    companyId: req.Company.id,
    BuildingFolders: {
      create: {
        BuildingFolder: {
          create: {
            name: 'Início',
          },
        },
      },
    },
  };

  // #region VALIDATIONS
  validator.check([
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
      label: 'Data de início',
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
      label: 'Tipo da criação da próxima manutenção',
      type: 'string',
      variable: data.nextMaintenanceCreationBasis,
    },
    {
      label: 'Anexos de chamados obrigatórios',
      type: 'boolean',
      variable: data.ticketAnnexRequired,
    },
    {
      label: 'Mostrar todos os chamados para residente',
      type: 'boolean',
      variable: data.showAllTicketsToResident,
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

  // #endregion

  const building = await buildingServices.create({ data });

  await buildingServices.createAdminBuildingPermissions({
    buildingId: building.id,
  });

  if (process.env.DATABASE_URL?.includes('production')) {
    await emailTransporter.sendNewBuildingCreated({
      toEmail: 'contato@easyalert.com.br',
      companyName: building.Company.name,
      buildingName: building.name,
      subject: 'Nova edificação cadastrada',
    });
  }

  return res.status(200).json({
    building,
    ServerMessage: {
      statusCode: 201,
      message: `Edificação cadastrada com sucesso.`,
    },
  });
}
