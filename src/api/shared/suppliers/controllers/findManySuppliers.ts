import { Response, Request } from 'express';
import { IParsedFilter, supplierServices } from '../services/supplierServices';
import { handleQueryPage } from '../../../../utils/dataHandler';

interface IQuery {
  page: string;
  filter?: string;
}

export async function findManySuppliers(req: Request, res: Response) {
  const { page, filter } = req.query as any as IQuery;

  const parsedFilter: IParsedFilter = filter ? JSON.parse(filter) : null;

  const { suppliers, suppliersCount } = await supplierServices.findMany({
    page: handleQueryPage(page),
    take: 10,
    companyId: req.Company.id,
    filter: parsedFilter,
  });

  return res.status(200).json({ suppliers, suppliersCount });
}
