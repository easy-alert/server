import { Request, Response } from 'express';
import { deleteTicketChecklistItem } from '../../../shared/ticketChecklist/services/deleteTicketChecklistItem';

export const deleteTicketChecklistItemController = async (req: Request, res: Response) => {
  const { itemId } = req.params as { itemId: string };
  const { userId } = req.body as { userId: string };
  await deleteTicketChecklistItem({ itemId, userId });
  res.status(200).json({ ServerMessage: { statusCode: 204, message: 'Item de checklist apagado com sucesso.' } });
};
