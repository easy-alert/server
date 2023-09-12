// # region IMPORTS
import { Request, Response } from 'express';

import { Validator } from '../../../../utils/validator/validator';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { sharedBuildingAccessHistoryService } from '../../../shared/buildingAccessHistory/sharedBuildingAccessHistory';

// CLASS

const buildingServices = new BuildingServices();

const validator = new Validator();
// #endregion

export async function clientCreateBuildingAccessHistory(req: Request, res: Response) {
  const { buildingNanoId } = req.body;

  // #region VALIDATION

  validator.check([
    {
      label: 'Id da edificação',
      type: 'string',
      variable: buildingNanoId,
    },
  ]);

  const building = await buildingServices.findByNanoId({ buildingNanoId });

  // #endregion

  await sharedBuildingAccessHistoryService.create({ buildingId: building.id, key: 'client' });

  return res.sendStatus(200);
}
