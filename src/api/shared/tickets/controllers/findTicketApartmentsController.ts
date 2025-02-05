import { Request, Response } from 'express';

import { ticketServices } from '../services/ticketServices';

export async function findTicketApartmentsController(req: Request, res: Response) {
  const { buildingNanoId } = req.params;

  const ticketApartments = await ticketServices.findManyTicketApartments({ buildingNanoId });

  return res.status(200).json(ticketApartments);
}
