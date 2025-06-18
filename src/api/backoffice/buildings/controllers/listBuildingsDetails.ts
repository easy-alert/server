import { Request, Response } from 'express';
import { searchById } from '../services/searchById';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export async function listBuildingsDetails(req: Request, res: Response) {
  const { buildingId } = req.params;

  validator.check([{ label: 'ID da edificação', type: 'string', variable: buildingId }]);

  const building = await searchById(buildingId);

  return res.status(200).json(building);
}
