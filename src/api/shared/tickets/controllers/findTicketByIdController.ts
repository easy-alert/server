import { Response, Request } from 'express';
import { ticketServices } from '../services/ticketServices';
import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

export async function findTicketByIdController(req: Request, res: Response) {
  const { ticketId } = req.params as any as { ticketId: string };

  checkValues([{ label: 'ID do chamado', type: 'string', value: ticketId }]);

  const ticket = await ticketServices.findById(ticketId);

  if (!ticket.building?.Company?.canAccessTickets) {
    throw new ServerMessage({
      statusCode: 403,
      message: `Sua empresa não possui acesso a este módulo.`,
    });
  }

  return res.status(200).json({ ticket });
}
