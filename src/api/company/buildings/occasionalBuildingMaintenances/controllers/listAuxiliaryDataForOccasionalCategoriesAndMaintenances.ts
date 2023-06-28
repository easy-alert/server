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
    buildingId: undefined,
  });

  const CategoriesData = await sharedCategoryServices.listOccasionalForSelect({
    ownerCompanyId: req.Company.id,
  });

  const Categories: { id: string; name: string }[] = [];

  CategoriesData.forEach((categoryData) => {
    const categoryFound = Categories.find((category) => category.name === categoryData.name);

    if (!categoryFound) {
      Categories.push({
        id: categoryData.id,
        name: categoryData.name,
      });
    }
  });

  return res.status(200).json({ Categories, Buildings });
}
