// # region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { BuildingTypeServices } from '../services/buildingTypeServices';

const buildingTypesServices = new BuildingTypeServices();
// #endregion

export async function listBuildingTypes(_req: Request, res: Response) {
  const BuildingsTypes = await buildingTypesServices.list();

  return res.status(200).json(BuildingsTypes);
}
