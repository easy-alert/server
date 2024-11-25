import { Request, Response } from 'express';

import { findManyTicketPlaces } from '../services/findManyTicketPlaces';

export async function findAllTicketPlaces(req: Request, res: Response) {
  const { placeId } = req.params;

  const placesFilter = placeId === 'all' ? undefined : placeId;

  const ticketPlaces = await findManyTicketPlaces({ placesFilter });

  return res.status(200).json(ticketPlaces);
}
