import type { TicketStatusName } from '@prisma/client';

import { Request, Response } from 'express';

import { findManyStatus } from '../services/findManyStatus';

export async function findAllStatus(req: Request, res: Response) {
  const { statusName } = req.params;

  const statusNameFilter = statusName === 'all' ? undefined : (statusName as TicketStatusName);

  const ticketPlaces = await findManyStatus({ statusNameFilter });

  return res.status(200).json(ticketPlaces);
}
