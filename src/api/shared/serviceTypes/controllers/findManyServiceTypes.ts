import { Request, Response } from 'express';
import { serviceTypesServices } from '../services/serviceTypesService';

interface IParams {
  buildingNanoId: string;
  page: number;
  take: number;
}

export async function findManyServiceTypes(req: Request, res: Response) {
  const { buildingNanoId, page, take } = req.params as any as IParams;

  const serviceTypes = await serviceTypesServices.findMany({ buildingNanoId, page, take });

  return res.status(200).json(serviceTypes);
}
