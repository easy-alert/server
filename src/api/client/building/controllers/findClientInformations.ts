import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { ClientBuildingServices } from '../services/clientBuildingServices';

const clientBuildingServices = new ClientBuildingServices();
const buildingServices = new BuildingServices();

const validator = new Validator();

export async function findClientInformations(req: Request, res: Response) {
  const { buildingNanoId } = req.params;

  validator.check([{ label: 'Id da edificaçao', type: 'string', variable: buildingNanoId }]);

  const building = await buildingServices.findByNanoId({ buildingNanoId });

  const mainContact = await clientBuildingServices.findMainContactInformation({
    buildingId: building.id,
  });

  const formattedMainContact = {
    buildingName: mainContact?.name,
    mainContact: mainContact?.NotificationsConfigurations[0] ?? null,
  };

  return res.status(200).json(formattedMainContact);
}
