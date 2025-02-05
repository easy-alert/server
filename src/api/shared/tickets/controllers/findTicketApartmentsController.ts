import { Request, Response } from 'express';

import { ticketServices } from '../services/ticketServices';

export async function findTicketApartmentsController(req: Request, res: Response) {
  const { buildingNanoId } = req.params;

  const buildingNanoIdArray = buildingNanoId.split(',');

  let ticketsApartmentsArray: any[] = [];

  for (const element of buildingNanoIdArray) {
    const ticketApartments = await ticketServices.findManyTicketApartments({
      buildingNanoId: element,
    });

    if (ticketApartments) {
      ticketsApartmentsArray = ticketsApartmentsArray.concat(Object.values(ticketApartments));
    }
  }

  return res.status(200).json(ticketsApartmentsArray);
}
