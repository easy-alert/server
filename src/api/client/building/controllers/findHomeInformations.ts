import { Request, Response } from 'express';

import { ClientBuildingServices } from '../services/clientBuildingServices';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

import { Validator } from '../../../../utils/validator/validator';

const clientBuildingServices = new ClientBuildingServices();
const validator = new Validator();

export async function findHomeInformations(req: Request, res: Response) {
  const { buildingId } = req.params;

  validator.check([{ label: 'Id da edificação', type: 'string', variable: buildingId }]);

  let building = null;

  if (buildingId.length === 12) {
    building = await buildingServices.findByNanoId({
      buildingNanoId: buildingId,
    });
  } else {
    building = await buildingServices.findById({ buildingId });
  }

  const homeInformations = await clientBuildingServices.findHomeInformation({
    buildingId: building ? building.id : buildingId,
  });

  return res.status(200).json(homeInformations);
}
