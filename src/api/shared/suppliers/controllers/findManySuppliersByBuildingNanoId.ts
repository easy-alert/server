import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { handleQueryPage, handleQueryTake } from '../../../../utils/dataHandler';

interface IQuery {
  page: string;
  take: string;
  search?: string;
  buildingNanoId: string;
}

export async function findManySuppliersByBuildingNanoId(req: Request, res: Response) {
  const { page, take, search, buildingNanoId } = req.query as any as IQuery;

  const { suppliers, suppliersCount } = await supplierServices.findManyByBuildingNanoId({
    page: handleQueryPage(page),
    take: handleQueryTake(take, 10),
    search,
    buildingNanoId,
  });

  return res.status(200).json({ suppliers, suppliersCount });
}
