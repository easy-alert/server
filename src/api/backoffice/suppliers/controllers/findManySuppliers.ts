import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';

export async function findManySuppliers(req: Request, res: Response) {
  const { search = '' } = req.query as any as { search?: string };

  const suppliers = await supplierServices.findMany(search);

  return res.status(200).json({ suppliers });
}
