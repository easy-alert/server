import { TicketChecklistItem } from "@prisma/client";
import { checkValues, needExist } from "../../../../utils/newValidator";
import { prisma } from "../../../../../prisma";
import { createOneTicketHistoryActivity } from "../../ticketHistoryActivities/services/createOneTicketHistoryActivity";

interface ICompleteTicketChecklistItemInput {
  itemId: string;
  // usado para histórico e autoria de conclusão
  userId?: string;
}

export async function completeTicketChecklistItem({
  itemId,
  userId,
}: ICompleteTicketChecklistItemInput): Promise<TicketChecklistItem> {
  checkValues([{ value: itemId, label: 'Item do checklist', type: 'string' }]);

  const item = await prisma.ticketChecklistItem.findUnique({
    select: { id: true, title: true, status: true, ticketId: true },
    where: { id: itemId },
  });
  needExist([{ label: 'Item do checklist', variable: item }]);

  const isPending = item!.status === 'pending';

  const updated = await prisma.ticketChecklistItem.update({
    where: { id: itemId },
    data: isPending
      ? { status: 'completed', completedAt: new Date(), completedById: userId }
      : { status: 'pending', completedAt: null, completedById: null },
  });

  await createOneTicketHistoryActivity({
    ticketId: item!.ticketId,
    syndicNanoId: undefined,
    userId,
    activityContent: `Item de checklist ${isPending ? 'concluído' : 'reaberto'}: ${item!.title}`,
    activityImages: [],
    type: 'notification',
  });

  return updated;
}
