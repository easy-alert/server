import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { ClientBuildingServices } from '../services/clientBuildingServices';

const clientBuildingServices = new ClientBuildingServices();

const validator = new Validator();

export async function findLocalSuppliers(req: Request, res: Response) {
  const { buildingNanoId } = req.params;

  validator.check([{ label: 'Id da edificaçao', type: 'string', variable: buildingNanoId }]);

  const suppliers = await clientBuildingServices.findLocalSuppliers({ buildingNanoId });

  return res.status(200).json({ suppliers });
}
