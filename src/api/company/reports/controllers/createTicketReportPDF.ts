import { Request, Response } from 'express';
import type { Ticket } from '@prisma/client';

import { findManyTicketsController } from '../../../shared/tickets/controllers/findManyTicketsController';

import { findFirstTicketReportPDF } from '../services/findFirstTicketReportPDF';

import { ServerMessage } from '../../../../utils/messages/serverMessage';

interface IFindManyTicketsRaw {
  tickets: Ticket[];
  buildingName: string;
  filterOptions: {};
}

export async function createTicketReportPDF(req: Request, res: Response) {
  const previousTicket = await findFirstTicketReportPDF({ userId: req.userId, orderBy: 'desc' });

  if (previousTicket?.status === 'pending') {
    throw new ServerMessage({
      message: 'Aguarde o último relatório ser finalizado para gerar um novo.',
      statusCode: 400,
    });
  }

  // let imageCount = 0;

  // findManyTicketsRaw.tickets.forEach((ticket) => {
  //   MaintenanceReport.forEach(({ ReportImages }) => {
  //     imageCount += ReportImages.length;
  //   });
  // });

  // const imageLimit = 500;

  // if (imageCount > imageLimit) {
  //   throw new ServerMessage({
  //     message: `Você selecionou manutenções contendo ${imageCount} imagens. O limite para o PDF é ${imageLimit} imagens.`,
  //     statusCode: 400,
  //   });
  // }

  // const { id } = await prisma.maintenanceReportPdf.create({
  //   data: {
  //     name: `Período de ${
  //       queryFilter.filterBy === 'notificationDate' ? 'notificação' : 'vencimento'
  //     } - ${dateFormatter(queryFilter.dateFilter.gte)} a ${dateFormatter(
  //       queryFilter.dateFilter.lte,
  //     )}`,
  //     authorId: req.userId,
  //     authorCompanyId: req.Company.id,
  //   },
  // });

  // PDFService({ company, id, query, maintenancesHistory, req, MaintenancesPending, queryFilter });

  // return res.status(200).json({ ServerMessage: { message: 'Geração de PDF em andamento.' } });
}
