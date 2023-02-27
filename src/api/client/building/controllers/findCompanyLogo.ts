// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { ClientBuildingServices } from '../services/clientBuildingServices';

// CLASS

const clientBuildingServices = new ClientBuildingServices();

const validator = new Validator();
// #endregion

export async function findCompanyLogo(req: Request, res: Response) {
  const { buildingId } = req.params;

  validator.check([
    {
      label: 'Id da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  const companyImage = await clientBuildingServices.findCompanyLogo({ buildingId });

  return res.status(200).json(companyImage);
}
