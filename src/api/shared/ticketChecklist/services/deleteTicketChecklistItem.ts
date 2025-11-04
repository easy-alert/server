import { prisma } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';
import { createOneTicketHistoryActivity } from '../../ticketHistoryActivities/services/createOneTicketHistoryActivity';

const validator = new Validator();

interface IDeleteTicketChecklistItemInput {
  itemId: string;
  userId?: string;
}

export async function deleteTicketChecklistItem({
  itemId,
  userId,
}: IDeleteTicketChecklistItemInput): Promise<void> {
  validator.check([{ label: 'Item do checklist', variable: itemId, type: 'string' }]);

  const item = await prisma.ticketChecklistItem.findUnique({
    select: { id: true, title: true, ticketId: true, position: true },
    where: { id: itemId },
  });
  validator.needExist([{ label: 'Item do checklist', variable: item }]);

  const ticketId = item!.ticketId;

  await prisma.$transaction(async (tx) => {
    await tx.ticketChecklistItem.delete({ where: { id: itemId } });

    // opcional: recompactar posições para manter sequência 0..n-1
    const items = await tx.ticketChecklistItem.findMany({
      select: { id: true },
      where: { ticketId },
      orderBy: { position: 'asc' },
    });

    for (let index = 0; index < items.length; index++) {
      const id = items[index].id;
      await tx.ticketChecklistItem.update({ where: { id }, data: { position: index } });
    }
  });

  await createOneTicketHistoryActivity({
    ticketId,
    syndicNanoId: undefined,
    userId,
    activityContent: `Item de checklist excluído: ${item!.title}`,
    activityImages: [],
    type: 'notification',
  });
}
