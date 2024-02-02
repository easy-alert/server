// #region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceReportProgressesServices } from '../services/SharedMaintenanceReportProgressesServices';

const validator = new Validator();
const sharedMaintenanceReportProgressesServices = new SharedMaintenanceReportProgressesServices();

// #endregion

export interface IBody {
  maintenanceHistoryId: string;
  cost: number;
  observation: string;

  ReportImages: {
    name: string;
    originalName: string;
    url: string;
  }[];

  ReportAnnexes: {
    name: string;
    originalName: string;
    url: string;
  }[];
}

export async function sharedCreateReportProgress(req: Request, res: Response) {
  const { cost, maintenanceHistoryId, observation, ReportAnnexes, ReportImages }: IBody = req.body;

  // #region VALIDATIONS
  validator.check([
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
  ]);

  ReportAnnexes?.forEach((annex) => {
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

  ReportImages?.forEach((annex) => {
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

  await sharedMaintenanceReportProgressesServices.create({
    data: {
      cost: cost || 0,
      observation: observation || null,
      maintenanceHistoryId,
      ReportAnnexesProgress: {
        createMany: {
          data: Array.isArray(ReportAnnexes) ? ReportAnnexes : [],
        },
      },
      ReportImagesProgress: {
        createMany: {
          data: Array.isArray(ReportImages) ? ReportImages : [],
        },
      },
    },
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Progresso salvo com sucesso.`,
    },
  });
}
