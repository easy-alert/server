import { Request, Response } from 'express';

import { findFirstTicketReportPDF } from '../services/findFirstTicketReportPDF';
import { findManyTicketsForReportPDF } from '../services/findManyTicketsForReportPDF';
import { createTicketReportPDF } from '../services/createTicketReportPDF';

import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { handleTicketsFilters } from '../../../../utils/filters/handleTicketsFilters';
import {
  dateFormatter,
  setToUTCLastMinuteOfDay,
  setToUTCMidnight,
} from '../../../../utils/dateTime';

export interface IFilterOptions {
  buildingsNames: string;
  placesNames: string;
  serviceTypesNames: string;
  statusNames: string;
  interval: string;
}

export async function generateTicketReportPDF(req: Request, res: Response) {
  const previousTicket = await findFirstTicketReportPDF({ userId: req.userId, orderBy: 'desc' });

  if (previousTicket?.status === 'pending') {
    throw new ServerMessage({
      message: 'Aguarde o último relatório ser finalizado para gerar um novo.',
      statusCode: 400,
    });
  }

  const {
    buildingsNanoId,
    buildingsNames,
    placesId,
    placesNames,
    serviceTypesId,
    serviceTypesNames,
    status,
    statusNames,
    startDate,
    endDate,
    seen,
    page,
    take,
  } = req.body;

  const {
    companyIdFilter,
    buildingsNanoIdFilter,
    placeIdFilter,
    serviceTypeIdFilter,
    statusFilter,
    seenFilter,
    startDateFilter,
    endDateFilter,
  } = handleTicketsFilters({
    Company: req.Company,
    buildingsNanoId,
    placesId,
    serviceTypesId,
    status,
    startDate,
    endDate,
    seen,
  });

  const dataForPDF = await findManyTicketsForReportPDF({
    buildingNanoId: buildingsNanoIdFilter,
    companyId: companyIdFilter,
    statusName: statusFilter,
    placeId: placeIdFilter,
    serviceTypeId: serviceTypeIdFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    seen: seenFilter,
    page: Number(page),
    take: Number(take),
  });

  const imageLimit = 500;
  let imageCount = 0;

  dataForPDF.tickets.forEach((ticket) => {
    imageCount += ticket.images.length;
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
    placesNames,
    serviceTypesNames,
    statusNames,
    interval: `De ${formattedStartDate} a ${formattedEndDate}`,
  };

  await createTicketReportPDF({
    userId: req.userId,
    companyId: req.Company.id,
    dataForPDF,
    filterOptions,
  });

  return res.status(200).json({ ServerMessage: { message: 'Geração de PDF em andamento.' } });
}
