import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

export async function findManyAreaOfActivities(req: Request, res: Response) {
  const { findAll, buildingNanoId } = req.query as any as {
    findAll: string | undefined;
    buildingNanoId: string | undefined;
  };

  let companyId = findAll === 'true' ? req.Company?.id : undefined;

  if (buildingNanoId && findAll === 'true') {
    const building = await buildingServices.findByNanoId({ buildingNanoId });
    companyId = building.companyId;
  }

  const areaOfActivities = await supplierServices.findAreaOfActivities({
    companyId,
  });

  return res.status(200).json({ areaOfActivities });
}
