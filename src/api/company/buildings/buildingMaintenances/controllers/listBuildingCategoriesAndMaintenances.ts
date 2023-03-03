// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';
import { CategoryServices } from '../../../categories/category/services/categoryServices';

// CLASS
import { BuildingServices } from '../../building/services/buildingServices';
import { IListBuildingCategoriesAndMaintenances } from './types';

const buildingServices = new BuildingServices();
const validator = new Validator();
const categoryServices = new CategoryServices();

// #endregion

export async function listBuildingCategoriesAndMaintenances(req: Request, res: Response) {
  const { buildingId } = req.body;

  // #region VALIDATION
  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);
  const building = await buildingServices.findById({
    buildingId,
  });
  // #endregion

  const CategoriesData = (await categoryServices.list({
    ownerCompanyId: req.Company.id,
    search: '',
  })) as IListBuildingCategoriesAndMaintenances[];

  const BuildingCategories = await buildingServices.listMaintenances({
    buildingId,
  });

  // #region PROCESS DATA

  for (let i = 0; i < CategoriesData.length; i++) {
    for (let j = 0; j < CategoriesData[i].Maintenances.length; j++) {
      CategoriesData[i].Maintenances[j] = {
        ...CategoriesData[i].Maintenances[j],
        isSelected: false,
      };
    }
  }

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
          if (
            CategoriesData[categoriesDataIndex].Maintenances[categoriesDataMaintenanceIndex].id ===
            BuildingCategories[buildingDataIndex].Maintenances[buildingDataMaintenanceIndex]
              .Maintenance.id
          ) {
            CategoriesData[categoriesDataIndex].Maintenances[categoriesDataMaintenanceIndex] = {
              ...CategoriesData[categoriesDataIndex].Maintenances[categoriesDataMaintenanceIndex],
              isSelected: true,
            };
          }
        }
      }
      // #endregion
    }
  }

  return res.status(200).json({ buildingName: building?.name, CategoriesData });
}
