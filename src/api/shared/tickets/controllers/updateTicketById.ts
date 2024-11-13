import type { Ticket } from '@prisma/client';

import { Response, Request } from 'express';

import { ticketServices } from '../services/ticketServices';
import { createOneTicketHistoryActivity } from '../../ticketHistoryActivities/services/createOneTicketHistoryActivity';

import { checkValues } from '../../../../utils/newValidator';

interface IBody {
  updatedTicket: Ticket;
}

const handleCreateOneTicketHistoryActivity = async (ticketId: string, updatedTicket: Ticket) => {
  let activityContent = '';

  switch (updatedTicket.statusName) {
    case 'open':
      activityContent = 'Chamado atualizado com status "Aberto"';
      break;
    case 'awaitingToFinish':
      activityContent = 'Chamado atualizado com status "Aguardando Finalização"';
      break;

    case 'finished':
      activityContent = 'Chamado atualizado com status "Concluído"';
      break;

    case 'dismissed':
      activityContent = 'Chamado atualizado com status "Indeferido"';
      break;

    default:
      break;
  }

  createOneTicketHistoryActivity({
    ticketId,
    syndicNanoId: updatedTicket.dismissedById || '',
    activityContent,
    userId: '',
    activityImages: [],
    type: 'notification',
  });
};

export async function updateTicketById(req: Request, res: Response) {
  const { ticketId } = req.params;
  const { updatedTicket } = req.body as IBody;

  checkValues([{ value: ticketId, label: 'Ticket ID', type: 'string', required: true }]);

  await ticketServices.updateOneTicket({
    ticketId,
    updatedTicket,
  });

  handleCreateOneTicketHistoryActivity(ticketId, updatedTicket);

  if (updatedTicket.statusName === 'open' || updatedTicket.statusName === 'awaitingToFinish') {
    ticketServices.sendStatusChangedEmails({
      ticketIds: [ticketId],
    });
  }

  if (updatedTicket.statusName === 'finished') {
    ticketServices.sendFinishedTicketEmails({
      ticketIds: [ticketId],
    });
  }

  if (updatedTicket.statusName === 'dismissed') {
    ticketServices.sendDismissedTicketEmails({
      ticketIds: [ticketId],
    });
  }

  return res.status(200).json({ ServerMessage: { message: 'Ticket foi atualizado com sucesso' } });
}
