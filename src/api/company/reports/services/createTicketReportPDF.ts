import type {
  Ticket,
  TicketHistoryActivities,
  TicketImage,
  TicketPlace,
  TicketStatus,
} from '@prisma/client';
import { prisma } from '../../../../../prisma';

import { ticketPDFService } from './ticketPDFService';

import { ServerMessage } from '../../../../utils/messages/serverMessage';

import type { IFilterOptions } from '../controllers/generateTicketReportPDF';

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
    place?: TicketPlace | null;
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
  filterOptions: IFilterOptions;
}

export async function createTicketReportPDF({
  userId,
  companyId,
  dataForPDF,
  filterOptions,
}: ICreateTicketReportPDF) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { image: true },
  });

  const { id } = await prisma.ticketReportPDF.create({
    data: {
      name: filterOptions.interval,
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

  ticketPDFService({
    reportId: id,
    companyImage: company?.image,
    dataForPDF,
    filterOptions,
  });
}
