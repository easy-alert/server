import { Request, Response } from 'express';

import type { ChecklistStatusName } from '@prisma/client';

import { createChecklistReportPDF } from '../services/createChecklistReportPDF';
import { findManyChecklistsForReportPDF } from '../services/findManyChecklistsForReportPDF';
import { findFirstChecklistReportPDF } from '../services/findFirstChecklistReportPDF';

import { ServerMessage } from '../../../../utils/messages/serverMessage';
import {
  changeUTCTime,
  dateFormatter,
  setToUTCLastMinuteOfDay,
  setToUTCMidnight,
} from '../../../../utils/dateTime';
import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../utils/permissions/handlePermittedBuildings';

export interface IFilterOptions {
  buildingsNames: string;
  statusNames: string;
  interval: string;
}

export async function generateChecklistReportPDFController(req: Request, res: Response) {
  const previousChecklist = await findFirstChecklistReportPDF({
    userId: req.userId,
    orderBy: 'desc',
  });

  if (previousChecklist?.status === 'pending') {
    throw new ServerMessage({
      message: 'Aguarde o último relatório ser finalizado para gerar um novo.',
      statusCode: 400,
    });
  }

  const { Company } = req;
  const { buildingsId, buildingsNames, status, statusNames, startDate, endDate, page, take } =
    req.body;

  const isAdmin = hasAdminPermission(req.Permissions);
  const permittedBuildingsIds = isAdmin
    ? undefined
    : handlePermittedBuildings(req.BuildingsPermissions, 'id');

  const companyIdFilter = Company ? Company?.id : undefined;

  const buildingsIdFilter = !buildingsId ? permittedBuildingsIds : buildingsId.split(',');
  const statusFilter =
    typeof status === 'string' && status !== ''
      ? (status.split(',') as ChecklistStatusName[])
      : undefined;

  const startDateFilter = startDate
    ? changeUTCTime(new Date(String(startDate)), 0, 0, 0, 0)
    : undefined;
  const endDateFilter = endDate
    ? changeUTCTime(new Date(String(endDate)), 23, 59, 59, 999)
    : undefined;

  const dataForPDF = await findManyChecklistsForReportPDF({
    companyId: companyIdFilter,
    buildingId: buildingsIdFilter,
    status: statusFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    page,
    take,
  });

  const imageLimit = 500;
  let imageCount = 0;

  dataForPDF.checklists.forEach((checklist) => {
    imageCount += checklist.images.length;
  });

  if (imageCount > imageLimit) {
    throw new ServerMessage({
      message: `Você selecionou chamados contendo ${imageCount} imagens. O limite para o PDF é ${imageLimit} imagens.`,
      statusCode: 400,
    });
  }

  const formattedStartDate = dateFormatter(setToUTCMidnight(startDate));
  const formattedEndDate = dateFormatter(setToUTCLastMinuteOfDay(endDate));

  const filterOptions: IFilterOptions = {
    buildingsNames,
    statusNames,
    interval: `De ${formattedStartDate} a ${formattedEndDate}`,
  };

  await createChecklistReportPDF({
    userId: req.userId,
    companyId: req.Company.id,
    dataForPDF,
    filterOptions,
  });

  return res.status(200).json({ ServerMessage: { message: 'Geração de PDF em andamento.' } });
}
