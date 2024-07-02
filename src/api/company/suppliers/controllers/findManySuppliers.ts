import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { handleQueryPage, handleQueryTake } from '../../../../utils/dataHandler';

interface IQuery {
  page: string;
  take: string;
  search?: string;
}

export async function findManySuppliers(req: Request, res: Response) {
  const { page, take, search } = req.query as any as IQuery;

  const suppliers = await supplierServices.findMany({
    page: handleQueryPage(page),
    take: handleQueryTake(take),
    search,
  });

  return res.status(200).json({ suppliers });
}
