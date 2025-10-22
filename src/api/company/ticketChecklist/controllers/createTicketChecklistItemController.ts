import { Request, Response } from 'express';
import { createTicketChecklistItem } from '../../../shared/ticketChecklist/services/createTicketChecklistItem';

export const createTicketChecklistItemController = async (req: Request, res: Response) => {
  const { ticketId } = req.params as { ticketId: string };
  const { title, userId } = req.body as { title: string; userId: string };
  const ticketChecklistItem = await createTicketChecklistItem({ ticketId, title, userId });
  res.status(201).json({ item: ticketChecklistItem, ServerMessage: { statusCode: 201, message: 'Item de checklist criado com sucesso.' } });
};
