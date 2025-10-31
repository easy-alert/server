import { Request, Response } from 'express';
import { moveTicketChecklistItem } from '../../../shared/ticketChecklist/services/moveTicketChecklistItem';

export const moveTicketChecklistItemController = async (req: Request, res: Response) => {
  const { itemId } = req.params as { itemId: string };
  const { direction } = req.body as { direction: 'up' | 'down' };
  const items = await moveTicketChecklistItem({ itemId, direction });
  res.status(200).json({ items, ServerMessage: { statusCode: 200, message: 'Item de checklist movido com sucesso.' } });
};
