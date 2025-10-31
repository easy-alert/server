import type { TicketChecklistItem } from '@prisma/client';

import { prisma } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';
import { createOneTicketHistoryActivity } from '../../ticketHistoryActivities/services/createOneTicketHistoryActivity';

const validator = new Validator();

interface ICreateTicketChecklistItemInput {
  ticketId: string;
  title: string;
  userId?: string;
}

export async function createTicketChecklistItem({
  ticketId,
  title,
  userId,
}: ICreateTicketChecklistItemInput): Promise<TicketChecklistItem> {
  validator.check([
    { label: 'Ticket', variable: ticketId, type: 'string' },
    { label: 'Título', variable: title, type: 'string' },
  ]);

  const ticket = await prisma.ticket.findUnique({ select: { id: true }, where: { id: ticketId } });
  validator.needExist([{ label: 'Ticket', variable: ticket }]);

  const { _max } = await prisma.ticketChecklistItem.aggregate({
    _max: { position: true },
    where: { ticketId },
  });

  const nextPosition = (typeof _max.position === 'number' ? _max.position : -1) + 1;

  const item = await prisma.ticketChecklistItem.create({
    data: {
      ticketId,
      title: title.trim(),
      position: nextPosition,
    },
  });

  await createOneTicketHistoryActivity({
    ticketId,
    syndicNanoId: undefined,
    userId,
    activityContent: `Item de checklist criado: ${item.title}`,
    activityImages: [],
    type: 'notification',
  });

  return item;
}
