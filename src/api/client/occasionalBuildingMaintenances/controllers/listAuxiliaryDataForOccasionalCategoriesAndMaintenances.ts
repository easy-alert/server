// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { SharedCategoryServices } from '../../../shared/categories/services/sharedCategoryServices';

// CLASS

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

  const Categories = await sharedCategoryServices.listOccasionalForSelect({
    ownerCompanyId: building.companyId,
  });


  return res.status(200).json({ Categories });
}
