// #region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';

import { SharedMaintenanceReportsServices } from '../services/SharedMaintenanceReportsServices';
import { ICreateAndEditMaintenanceReportsBody } from './types';

// CLASS

const validator = new Validator();
const sharedMaintenanceReportsServices = new SharedMaintenanceReportsServices();

// #endregion

export async function sharedEditMaintenanceReport(req: Request, res: Response) {
  const {
    origin,
    cost,
    maintenanceHistoryId,
    responsibleSyndicId,
    observation,
    ReportAnnexes,
    ReportImages,
    maintenanceReportId,
  }: ICreateAndEditMaintenanceReportsBody = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'Id do relato',
      type: 'string',
      variable: maintenanceReportId,
    },
    {
      label: 'Id do histórico de manutenção',
      type: 'string',
      variable: maintenanceHistoryId,
    },
    {
      label: 'Custo da manutenção',
      type: 'number',
      variable: cost,
      isOptional: true,
    },
    {
      label: 'Observação da manutenção',
      type: 'string',
      variable: observation,
      isOptional: true,
    },
    {
      label: 'Id do síndico responsável',
      type: 'string',
      variable: responsibleSyndicId,
      isOptional: true,
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

  // #endregion

  const report = await sharedMaintenanceReportsServices.getReportVersion({ maintenanceReportId });

  validator.needExist([{ label: 'Relato de manutenção', variable: report }]);

  const data = {
    version: report && report.version + 0.1,
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

  await sharedMaintenanceReportsServices.deleteAnnexAndImages({ maintenanceReportId });

  const maintenanceReport = await sharedMaintenanceReportsServices.edit({
    data,
    maintenanceReportId,
  });

  await sharedMaintenanceReportsServices.createHistory({
    data: {
      version: report!.version + 0.1,
      origin,
      maintenanceReportId: maintenanceReport.id,
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
    },
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Relato editado com sucesso.`,
    },
  });
}
