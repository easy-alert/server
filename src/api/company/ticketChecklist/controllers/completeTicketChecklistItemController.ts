import { Request, Response } from 'express';
import { completeTicketChecklistItem } from '../../../shared/ticketChecklist/services/completeTicketChecklistItem';

export const completeTicketChecklistItemController = async (req: Request, res: Response) => {
  const { itemId } = req.params as { itemId: string };
  const { userId } = req.body as { userId: string };
  const ticketChecklistItem = await completeTicketChecklistItem({ itemId, userId });
  const message =
    ticketChecklistItem.status === 'completed'
      ? 'Item de checklist concluído com sucesso.'
      : 'Item de checklist reaberto com sucesso.';
  res
    .status(201)
    .json({
      item: ticketChecklistItem,
      ServerMessage: { statusCode: 201, message },
    });
};
