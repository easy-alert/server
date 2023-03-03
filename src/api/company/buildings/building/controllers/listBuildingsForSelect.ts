// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';

// CLASS
import { BuildingServices } from '../services/buildingServices';

const buildingServices = new BuildingServices();
const validator = new Validator();

// #endregion

export async function listBuildingForSelect(req: Request, res: Response) {
  const { buildingId } = req.params;

  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  await buildingServices.findById({ buildingId });

  const BuildingsForSelect = await buildingServices.listForSelect({
    companyId: req.Company.id,
    buildingId,
  });

  return res.status(200).json(BuildingsForSelect);
}
