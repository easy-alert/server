// # region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { SharedCategoryServices } from '../../../../shared/categories/services/sharedCategoryServices';
import { BuildingServices } from '../../../../company/buildings/building/services/buildingServices';
import { Validator } from '../../../../../utils/validator/validator';

const sharedCategoryServices = new SharedCategoryServices();
const buildingServices = new BuildingServices();
const validator = new Validator();

// #endregion

export async function listAuxiliaryDataForOccasionalCategoriesAndMaintenances(
  req: Request,
  res: Response,
) {
  const { buildingNanoId } = req.params;

  validator.check([
    {
      label: 'Id da edificação',
      type: 'string',
      variable: buildingNanoId,
    },
  ]);

  const building = await buildingServices.findByNanoId({ buildingNanoId });

  const CategoryData = await sharedCategoryServices.listOccasionalForSelect({
    ownerCompanyId: building.companyId,
  });

  const Categories: typeof CategoryData = [];

  CategoryData.forEach((categoryData) => {
    const categoryFound = Categories.find((category) => category.name === categoryData.name);

    if (!categoryFound) {
      Categories.push({
        id: categoryData.id,
        name: categoryData.name,
        Maintenances: categoryData.Maintenances,
      });
    }
  });

  return res.status(200).json({ Categories });
}
