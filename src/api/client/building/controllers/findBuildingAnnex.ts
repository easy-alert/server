import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { ClientBuildingServices } from '../services/clientBuildingServices';

const clientBuildingServices = new ClientBuildingServices();
const validator = new Validator();

export async function findBuildingAnnex(req: Request, res: Response) {
  const { buildingId } = req.params;

  validator.check([{ label: 'Id da edificaçao', type: 'string', variable: buildingId }]);

  const annex = await clientBuildingServices.findAnnexes({ buildingId });

  return res.status(200).json(annex);
}
