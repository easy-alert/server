import type {
  Ticket,
  TicketHistoryActivities,
  TicketImage,
  TicketPlace,
  TicketServiceType,
  TicketStatus,
} from '@prisma/client';
import { prisma } from '../../../../../prisma';

import { ticketPDFService } from './ticketPDFService';

import { dateFormatter } from '../../../../utils/dateTime';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

export interface IDataForPDF {
  tickets: (Ticket & {
    status: TicketStatus;
    images: TicketImage[];
    types: {
      type: {
        label: string;
        color: string;
        backgroundColor: string;
      };
    }[];
    place: TicketPlace;
    activities: TicketHistoryActivities[];
    building: { name: string };
  })[];
  ticketsStatus: TicketStatus[];
  openTicketsCount: number;
  awaitingToFinishTicketsCount: number;
  finishedTicketsCount: number;
  dismissedTicketsCount: number;
}

interface ICreateTicketReportPDF {
  userId: string;
  companyId: string;
  dataForPDF: IDataForPDF;
  startDate?: string;
  endDate?: string;
}

export async function createTicketReportPDF({
  userId,
  companyId,
  dataForPDF,
  startDate,
  endDate,
}: ICreateTicketReportPDF) {
  const formattedStartDate = dateFormatter(startDate);
  const formattedEndDate = dateFormatter(endDate);

  let reportName = '';

  if (formattedStartDate && formattedEndDate) {
    reportName = `Período de notificação de ${formattedStartDate} a ${formattedEndDate}`;
  }

  if (formattedStartDate && !formattedEndDate) {
    reportName = `Período de notificação desde ${formattedStartDate}`;
  }

  if (!formattedStartDate && formattedEndDate) {
    reportName = `Período de notificação até ${formattedEndDate}`;
  }

  if (!formattedStartDate && !formattedEndDate) {
    reportName = 'Relatório geral de tickets';
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { image: true },
  });

  const { id, name } = await prisma.ticketReportPDF.create({
    data: {
      name: reportName,
      authorId: userId,
      authorCompanyId: companyId,
    },
  });

  if (!id) {
    throw new ServerMessage({
      message: 'Erro ao criar relatório.',
      statusCode: 400,
    });
  }

  ticketPDFService({ reportId: id, reportName: name, companyImage: company?.image, dataForPDF });

  return { id };
}
