// #region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../../maintenance/services/sharedMaintenanceServices';
import { SharedMaintenanceReportsServices } from '../services/SharedMaintenanceReportsServices';
import { ICreateMaintenanceReportsBody } from './types';

// CLASS

const validator = new Validator();
const sharedMaintenanceReportsServices = new SharedMaintenanceReportsServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();

// #endregion

export async function sharedCreateMaintenanceReport(req: Request, res: Response) {
  const {
    cost,
    maintenanceHistoryId,
    observation,
    ReportAnnexes,
    ReportImages,
  }: ICreateMaintenanceReportsBody = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'Id do histórico de manutenção',
      type: 'string',
      variable: maintenanceHistoryId,
    },
    {
      label: 'custo da manutenção',
      type: 'number',
      variable: cost,
    },
    {
      label: 'observação da manutenção',
      type: 'string',
      variable: observation,
    },
  ]);

  ReportAnnexes.forEach((annex) => {
    validator.check([
      {
        label: 'nome do anexo',
        variable: annex.name,
        type: 'string',
      },
      {
        label: 'nome original do anexo',
        variable: annex.originalName,
        type: 'string',
      },
      {
        label: 'url do anexo',
        variable: annex.url,
        type: 'string',
      },
    ]);
  });

  ReportImages.forEach((annex) => {
    validator.check([
      {
        label: 'nome da imagem',
        variable: annex.name,
        type: 'string',
      },
      {
        label: 'nome original da imagem',
        variable: annex.originalName,
        type: 'string',
      },
      {
        label: 'url da imagem',
        variable: annex.url,
        type: 'string',
      },
    ]);
  });

  await sharedMaintenanceServices.findHistoryById({ maintenanceHistoryId });

  // #endregion

  const data = {
    maintenanceHistoryId,
    cost,
    observation,
    ReportImages: {
      createMany: {
        data: ReportImages,
      },
    },
    ReportAnnexes: {
      createMany: {
        data: ReportAnnexes,
      },
    },
  };

  await sharedMaintenanceReportsServices.create({ data });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: `Manutenção reportada com sucesso.`,
    },
  });
}
