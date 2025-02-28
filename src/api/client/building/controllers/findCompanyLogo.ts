// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { ClientBuildingServices } from '../services/clientBuildingServices';

// CLASS

const clientBuildingServices = new ClientBuildingServices();

const validator = new Validator();
const buildingServices = new BuildingServices();

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

  let building = null;

  if (buildingId.length === 12) {
    building = await buildingServices.findByNanoId({
      buildingNanoId: buildingId,
    });
  } else {
    building = await buildingServices.findById({ buildingId });
  }

  if (building.image) {
    return res.status(200).json(building.image);
  }

  const companyImage = await clientBuildingServices.findCompanyLogo({ buildingId: building.id });

  return res.status(200).json(companyImage);
}
