import { Request, Response } from 'express';

import { sharedBuildingAccessHistoryService } from '../../../../shared/buildingAccessHistory/sharedBuildingAccessHistory';
import { validator } from '../../../../../utils/validator/validator';

export async function listBuildingAccessHistories(req: Request, res: Response) {
  const { companyId } = req.params;

  validator.check([
    {
      label: 'companyId',
      variable: companyId,
      type: 'string',
    },
  ]);

  const companyData = await sharedBuildingAccessHistoryService.listByCompanyId({
    accessHistoryKey: 'client',
    companyId,
  });

  const processData = companyData?.Buildings?.map((building) => ({
    id: building.id,
    name: building.name,
    accessCount: building.BuildingsAccessHistory.length,
  })).sort((a, b) => b.accessCount - a.accessCount);

  const totalAccessCount = processData?.reduce((acc, curr) => acc + curr.accessCount, 0) || 0;

  processData?.push({
    id: 'TOTAL',
    name: 'TOTAL',
    accessCount: totalAccessCount,
  });

  return res.status(200).json(processData);
}
