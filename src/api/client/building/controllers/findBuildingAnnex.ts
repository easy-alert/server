import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { ClientBuildingServices } from '../services/clientBuildingServices';

const clientBuildingServices = new ClientBuildingServices();
const validator = new Validator();
const buildingServices = new BuildingServices();

export async function findBuildingAnnex(req: Request, res: Response) {
  const { buildingNanoId } = req.params;

  validator.check([{ label: 'Id da edificaçao', type: 'string', variable: buildingNanoId }]);

  const building = await buildingServices.findByNanoId({ buildingNanoId });

  const annex = await clientBuildingServices.findAnnexes({ buildingId: building.id });

  return res.status(200).json(annex);
}
