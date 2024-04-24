import { Response, Request } from 'express';
import { ticketServices } from '../services/ticketServices';
import { checkValues } from '../../../../utils/newValidator';

export async function deleteTicketController(req: Request, res: Response) {
  const { ticketId } = req.params as any as { ticketId: string };

  checkValues([{ label: 'ID do chamado', type: 'string', value: ticketId }]);

  await ticketServices.delete(ticketId);

  return res.status(201).json({ ServerMessage: { message: 'Chamado excluído com sucesso.' } });
}
