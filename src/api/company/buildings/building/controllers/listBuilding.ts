// # region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { BuildingServices } from '../services/buildingServices';

const buildingServices = new BuildingServices();
// #endregion

export async function listBuilding(req: Request, res: Response) {
  const { search, page } = req.query;

  const pagination = page ?? 1;

  const Buildings = await buildingServices.list({
    search: search as string,
    companyId: req.Company.id,
    page: Number(pagination),
  });

  return res.status(200).json(Buildings);
}
