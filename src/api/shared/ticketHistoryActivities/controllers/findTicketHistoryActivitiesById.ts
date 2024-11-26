import { Response, Request } from 'express';

import { findManyTicketHistoryActivities } from '../services/findManyTicketHistoryActivities';

import { checkValues } from '../../../../utils/newValidator';

export async function findTicketHistoryActivitiesById(req: Request, res: Response) {
  const { ticketId } = req.params as any as { ticketId: string };

  checkValues([{ label: 'ID do ticket', type: 'string', value: ticketId }]);

  const { ticketActivities } = await findManyTicketHistoryActivities(ticketId);

  return res.status(200).json({ ticketActivities });
}
