import { Response, Request } from 'express';

import { findManyTicketHistoryActivities } from '../services/findManyTicketHistoryActivities';

import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

export async function findTicketHistoryActivitiesById(req: Request, res: Response) {
  const { ticketId } = req.params as any as { ticketId: string };
  const { syndicNanoId } = req.query as any as { syndicNanoId: string };

  checkValues([{ label: 'ID do ticket', type: 'string', value: ticketId }]);

  if (!syndicNanoId && !req.Company) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Você não tem permissão para acessar as atividades.`,
    });
  }

  const { ticketActivities } = await findManyTicketHistoryActivities(ticketId);

  return res.status(200).json({ ticketActivities });
}
