// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';
import { CategoryServices } from '../../../categories/category/services/categoryServices';

// CLASS
import { BuildingServices } from '../../building/services/buildingServices';
import {
  IAllBuildingCategoriesAndMaintenances,
  IListBuildingCategoriesAndMaintenances,
} from './types';

const buildingServices = new BuildingServices();
const validator = new Validator();
const categoryServices = new CategoryServices();

// #endregion

export async function listBuildingCategoriesAndMaintenances(req: Request, res: Response) {
  const { buildingId, currentBuildingId } = req.body;

  // #region VALIDATION
  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  const building = await buildingServices.findById({
    buildingId: currentBuildingId,
  });

  await buildingServices.findById({
    buildingId,
  });
  // #endregion

  const allCategoriesAndMaintenances = (await categoryServices.list({
    ownerCompanyId: req.Company.id,
    search: '',
  })) as IListBuildingCategoriesAndMaintenances[];

  const buildingCategoriesAndMaintenances = await buildingServices.listMaintenances({
    buildingId,
  });

  // #region PROCESS DATA

  for (let i = 0; i < allCategoriesAndMaintenances.length; i++) {
    for (let j = 0; j < allCategoriesAndMaintenances[i].Maintenances.length; j++) {
      allCategoriesAndMaintenances[i].Maintenances[j] = {
        ...allCategoriesAndMaintenances[i].Maintenances[j],
        isSelected: false,
        hasHistory: false,
      };
    }
  }

  const allBuildingCategoriesAndMaintenances: IAllBuildingCategoriesAndMaintenances[] = [];

  buildingCategoriesAndMaintenances.forEach((category) =>
    category.Maintenances.forEach((maintenance) => {
      allBuildingCategoriesAndMaintenances.push({
        id: maintenance.Maintenance.id,
        hasHistory: category.Building.MaintenancesHistory.length > 0,
      });
    }),
  );

  for (let i = 0; i < allCategoriesAndMaintenances.length; i++) {
    for (let j = 0; j < allCategoriesAndMaintenances[i].Maintenances.length; j++) {
      const isEquals = allBuildingCategoriesAndMaintenances.filter(
        (maintenance) => maintenance.id === allCategoriesAndMaintenances[i].Maintenances[j].id,
      );

      if (isEquals.length === 0) continue;

      allCategoriesAndMaintenances[i].Maintenances[j] = {
        ...allCategoriesAndMaintenances[i].Maintenances[j],
        isSelected: true,
        hasHistory: isEquals[0].hasHistory,
      };
    }
  }

  // BACKUP

  // const CategoriesData = (await categoryServices.list({
  //   ownerCompanyId: req.Company.id,
  //   search: '',
  // })) as IListBuildingCategoriesAndMaintenances[];

  // const BuildingCategories = await buildingServices.listMaintenances({
  //   buildingId,
  // });

  // // all categories
  // for (
  //   let categoriesDataIndex = 0;
  //   categoriesDataIndex < CategoriesData.length;
  //   categoriesDataIndex++
  // ) {
  //   // categories building
  //   for (
  //     let buildingDataIndex = 0;
  //     buildingDataIndex < BuildingCategories.length;
  //     buildingDataIndex++
  //   ) {
  //     // all maintenances
  //     for (
  //       let categoriesDataMaintenanceIndex = 0;
  //       categoriesDataMaintenanceIndex < CategoriesData[categoriesDataIndex].Maintenances.length;
  //       categoriesDataMaintenanceIndex++
  //     ) {
  //       // maintenances building
  //       for (
  //         let buildingDataMaintenanceIndex = 0;
  //         buildingDataMaintenanceIndex < BuildingCategories[buildingDataIndex].Maintenances.length;
  //         buildingDataMaintenanceIndex++
  //       ) {
  //         if (
  //           CategoriesData[categoriesDataIndex].Maintenances[categoriesDataMaintenanceIndex].id ===
  //           BuildingCategories[buildingDataIndex].Maintenances[buildingDataMaintenanceIndex]
  //             .Maintenance.id
  //         ) {
  //           CategoriesData[categoriesDataIndex].Maintenances[categoriesDataMaintenanceIndex] = {
  //             ...CategoriesData[categoriesDataIndex].Maintenances[categoriesDataMaintenanceIndex],
  //             isSelected: true,
  //           };
  //         }
  //       }
  //     }
  //     // #endregion
  //   }
  // }

  return res
    .status(200)
    .json({ buildingName: building?.name, CategoriesData: allCategoriesAndMaintenances });
}
