import { Response, Request } from 'express';
import { ticketServices } from '../services/ticketServices';

export async function findTicketsAuxiliaryDataController(_req: Request, res: Response) {
  const { places, types } = await ticketServices.findAuxiliaryData();

  return res.status(200).json({ places, types });
}
