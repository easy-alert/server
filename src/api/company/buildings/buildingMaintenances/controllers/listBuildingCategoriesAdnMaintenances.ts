// # region IMPORTS
import { Request, Response } from 'express';
// import { CategoryServices } from '../../../categories/category/services/categoryServices';

// CLASS
import { BuildingServices } from '../../building/services/buildingServices';

const buildingServices = new BuildingServices();
// const categoryServices = new CategoryServices();
// #endregion

export async function listBuildingCategoriesAndMaintenances(req: Request, res: Response) {
  const { search, page } = req.query;

  const pagination = page ?? 1;

  const Buildings = await buildingServices.list({
    search: search as string,
    companyId: req.Company.id,
    page: Number(pagination),
  });

  return res.status(200).json(Buildings);
}
