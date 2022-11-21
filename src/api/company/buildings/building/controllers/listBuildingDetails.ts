// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';
import { CategoryServices } from '../../../categories/category/services/categoryServices';

// CLASS
import { BuildingServices } from '../services/buildingServices';
import { IListBuildingCategoriesAndMaintenances } from './types';

const buildingServices = new BuildingServices();
const categoryServices = new CategoryServices();

const validator = new Validator();
// #endregion

export async function listBuildingDetails(req: Request, res: Response) {
  const { buildingId } = req.params;

  // #region VALIDATION

  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  // #region PROCESS DATA

  const CategoriesData = (await categoryServices.list({
    ownerCompanyId: req.Company.id,
    search: '',
  })) as IListBuildingCategoriesAndMaintenances[];

  const BuildingCategories = await buildingServices.listMaintenances({
    buildingId,
  });

  let totalMaintenacesCount = 0;
  let usedMaintenacesCount = 0;

  // all categories
  for (
    let categoriesDataIndex = 0;
    categoriesDataIndex < CategoriesData.length;
    categoriesDataIndex++
  ) {
    // categories building
    for (
      let buildingDataIndex = 0;
      buildingDataIndex < BuildingCategories.length;
      buildingDataIndex++
    ) {
      // all maintenances
      for (
        let categoriesDataMaintenanceIndex = 0;
        categoriesDataMaintenanceIndex < CategoriesData[categoriesDataIndex].Maintenances.length;
        categoriesDataMaintenanceIndex++
      ) {
        // maintenances bulding
        for (
          let buildingDataMaintenanceIndex = 0;
          buildingDataMaintenanceIndex < BuildingCategories[buildingDataIndex].Maintenances.length;
          buildingDataMaintenanceIndex++
        ) {
          totalMaintenacesCount += 1;

          if (
            CategoriesData[categoriesDataIndex].Maintenances[categoriesDataMaintenanceIndex].id ===
            BuildingCategories[buildingDataIndex].Maintenances[buildingDataMaintenanceIndex]
              .Maintenance.id
          ) {
            usedMaintenacesCount += 1;
          }
        }
      }
    }
  }

  // #endregion

  await buildingServices.findById({ buildingId });

  // #endregion

  const BuildingDetails = await buildingServices.listDetails({ buildingId });

  return res.status(200).json({ BuildingDetails, usedMaintenacesCount, totalMaintenacesCount });
}
