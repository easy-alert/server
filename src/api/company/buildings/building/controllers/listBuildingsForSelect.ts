// # region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { BuildingServices } from '../services/buildingServices';

const buildingServices = new BuildingServices();
// #endregion

export async function listBuildingForSelect(req: Request, res: Response) {
  const permittedBuildings = req.BuildingsPermissions.map(
    (BuildingPermissions) => BuildingPermissions.Building.id,
  );

  const BuildingsForSelect = await buildingServices.listForSelect({
    permittedBuildings,
    companyId: req.Company.id,
  });

  return res.status(200).json(BuildingsForSelect);
}
