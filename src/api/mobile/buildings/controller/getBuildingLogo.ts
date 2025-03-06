import { Request, Response } from 'express';
import { findBuildingLogo } from '../services/findBuildingLogo';

import { checkValues, needExist } from '../../../../utils/newValidator';

export async function getBuildingLogo(req: Request, res: Response) {
  const { buildingId } = req.params as { buildingId: string };

  checkValues([{ label: 'ID do prédio', value: buildingId, type: 'string' }]);
  needExist([{ label: 'ID do prédio', variable: buildingId }]);

  const buildingLogo = await findBuildingLogo({ buildingId });

  return res.status(200).json({ buildingLogo });
}
