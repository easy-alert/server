import { TicketChecklistItem } from '@prisma/client';
import { prisma } from '../../../../../prisma';
import { checkValues, needExist } from '../../../../utils/newValidator';

interface IMoveTicketChecklistItemInput {
  itemId: string;
  direction: 'up' | 'down';
}

export async function moveTicketChecklistItem({
  itemId,
  direction,
}: IMoveTicketChecklistItemInput): Promise<TicketChecklistItem[]> {
  checkValues([
    { value: itemId, label: 'Item do checklist', type: 'string' },
    { value: direction, label: 'Direção', type: 'string' },
  ]);

  const item = await prisma.ticketChecklistItem.findUnique({
    select: { id: true, ticketId: true, position: true },
    where: { id: itemId },
  });
  needExist([{ label: 'Item do checklist', variable: item }]);

  const currentPosition = item!.position;
  const ticketId = item!.ticketId;

  const items = await prisma.ticketChecklistItem.findMany({
    select: { id: true, position: true },
    where: { ticketId },
    orderBy: { position: 'asc' },
  });

  const lastIndex = items.length - 1;
  const targetPosition = direction === 'up' ? currentPosition - 1 : currentPosition + 1;

  if (targetPosition < 0 || targetPosition > lastIndex) {
    // nothing to change; return current ordered list
    return prisma.ticketChecklistItem.findMany({
      where: { ticketId },
      orderBy: { position: 'asc' },
    });
  }

  const targetItem = items.find((i) => i.position === targetPosition)!;

  const temporaryPosition = -1;

  await prisma.$transaction(async (transaction) => {
    await transaction.ticketChecklistItem.update({ where: { id: itemId }, data: { position: temporaryPosition } });

    await transaction.ticketChecklistItem.update({ where: { id: targetItem.id }, data: { position: currentPosition } });

    await transaction.ticketChecklistItem.update({ where: { id: itemId }, data: { position: targetPosition } });
  });

  return prisma.ticketChecklistItem.findMany({ where: { ticketId }, orderBy: { position: 'asc' } });
}
