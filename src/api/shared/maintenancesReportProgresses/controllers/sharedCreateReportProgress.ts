// #region IMPORTS
import { Request, Response } from 'express';

import type { MaintenancePriorityName } from '@prisma/client';

import { SharedMaintenanceReportProgressesServices } from '../services/SharedMaintenanceReportProgressesServices';
import { createMaintenanceHistoryActivityCommentService } from '../../maintenanceHistoryActivities/services';
import { checkValues } from '../../../../utils/newValidator';

const sharedMaintenanceReportProgressesServices = new SharedMaintenanceReportProgressesServices();
// #endregion

export interface IBody {
  userId: string;
  maintenanceHistoryId: string;
  cost: number;
  observation: string;
  maintenancePriorityName: MaintenancePriorityName;

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
  const { syndicNanoId } = req.query as any as { syndicNanoId: string };
  const { userId, maintenanceHistoryId, cost, observation, ReportAnnexes, ReportImages }: IBody =
    req.body;

  // #region VALIDATIONS
  [
    {
      label: 'Id do histórico de manutenção',
      type: 'string',
      value: maintenanceHistoryId,
    },
    {
      label: 'Custo da manutenção',
      type: 'int',
      value: cost,
      required: false,
    },
    {
      label: 'Observação da manutenção',
      type: 'string',
      value: observation,
      required: false,
    },
  ];

  ReportAnnexes?.forEach((annex) => {
    checkValues([
      {
        label: 'nome do anexo',
        value: annex.name,
        type: 'string',
      },
      {
        label: 'nome original do anexo',
        value: annex.originalName,
        type: 'string',
      },
      {
        label: 'url do anexo',
        value: annex.url,
        type: 'string',
      },
    ]);
  });

  ReportImages?.forEach((annex) => {
    checkValues([
      {
        label: 'nome da imagem',
        value: annex.name,
        type: 'string',
      },
      {
        label: 'nome original da imagem',
        value: annex.originalName,
        type: 'string',
      },
      {
        label: 'url da imagem',
        value: annex.url,
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

  const annexesForActivity = Array.isArray(ReportAnnexes)
    ? ReportAnnexes.map(({ originalName, url }) => ({ originalName, url }))
    : [];

  const imagesForActivity = Array.isArray(ReportImages)
    ? ReportImages.map(({ originalName, url }) => ({ originalName, url }))
    : [];

  await createMaintenanceHistoryActivityCommentService({
    userId,
    maintenanceHistoryId,
    syndicNanoId,
    content: `O progresso foi salvo.`,
    images: [...annexesForActivity, ...imagesForActivity],
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Progresso salvo com sucesso.`,
    },
  });
}
