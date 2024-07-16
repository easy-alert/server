import { Response, Request } from 'express';
import { IParsedFilter, supplierServices } from '../services/supplierServices';
import { handleQueryPage } from '../../../../utils/dataHandler';

interface IQuery {
  page: string;
  buildingNanoId: string;
  filter?: string;
}

export async function findManySuppliersByBuildingNanoId(req: Request, res: Response) {
  const { page, buildingNanoId, filter } = req.query as any as IQuery;

  const parsedFilter: IParsedFilter = filter ? JSON.parse(filter) : null;

  const { suppliers, suppliersCount } = await supplierServices.findManyByBuildingNanoId({
    page: handleQueryPage(page),
    take: 10,
    buildingNanoId,
    filter: parsedFilter,
  });

  return res.status(200).json({ suppliers, suppliersCount });
}
