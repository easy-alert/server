import { Request, Response } from 'express';
import { findBuildingById } from '../services/findBuildingById';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export async function getBuildingDetails(req: Request, res: Response) {
  const { buildingId } = req.params;

  validator.check([{ label: 'ID da edificação', type: 'string', variable: buildingId }]);

  const building = await findBuildingById(buildingId);

  return res.status(200).json(building);
}
