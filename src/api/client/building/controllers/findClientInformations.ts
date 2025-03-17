import { Request, Response } from 'express';

import { Validator } from '../../../../utils/validator/validator';
import { ClientBuildingServices } from '../services/clientBuildingServices';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

const clientBuildingServices = new ClientBuildingServices();

const validator = new Validator();

export async function findClientInformations(req: Request, res: Response) {
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

  const buildingContacts = await clientBuildingServices.findContactInformation({
    buildingId: building ? building.id : buildingId,
  });

  return res.status(200).json({ buildingName: building.name, buildingContacts });
}
