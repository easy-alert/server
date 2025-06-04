// # region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { SharedCategoryServices } from '../../../../shared/categories/services/sharedCategoryServices';
import { BuildingServices } from '../../building/services/buildingServices';

const sharedCategoryServices = new SharedCategoryServices();
const buildingServices = new BuildingServices();

// #endregion

export async function listAuxiliaryDataForOccasionalCategoriesAndMaintenances(
  req: Request,
  res: Response,
) {
  const Buildings = await buildingServices.listForSelect({
    companyId: req.Company.id,
    permittedBuildings: undefined,
  });

  const Categories = await sharedCategoryServices.listOccasionalForSelect({
    ownerCompanyId: req.Company.id,
  });

  return res.status(200).json({ Categories, Buildings });
}
