// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../../../../shared/categories/maintenance/services/sharedMaintenanceServices';
import { CategoryServices } from '../../../categories/category/services/categoryServices';

// CLASS
import { BuildingServices } from '../services/buildingServices';
import { IListBuildingCategoriesAndMaintenances } from './types';

const buildingServices = new BuildingServices();
const categoryServices = new CategoryServices();
const sharedMaintenanceservices = new SharedMaintenanceServices();

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

  await buildingServices.findById({ buildingId });

  // #endregion

  // #region PROCESS DATA

  const CategoriesData = (await categoryServices.list({
    ownerCompanyId: req.Company.id,
    search: '',
  })) as IListBuildingCategoriesAndMaintenances[];

  const BuildingCategories = await buildingServices.listMaintenances({
    buildingId,
  });

  // #region GROUP IDS

  const buildingMaintenancesIds = [];

  for (let i = 0; i < CategoriesData.length; i++) {
    for (let j = 0; j < CategoriesData[i].Maintenances.length; j++) {
      buildingMaintenancesIds.push(CategoriesData[i].Maintenances[j].id);
    }
  }

  const usedBuildingMaintenancesIds: any = [];

  for (let i = 0; i < BuildingCategories.length; i++) {
    for (let j = 0; j < BuildingCategories[i].Maintenances.length; j++) {
      // if the id exists in the array, do not add it again
      if (
        !usedBuildingMaintenancesIds.includes(BuildingCategories[i].Maintenances[j].Maintenance.id)
      ) {
        usedBuildingMaintenancesIds.push(BuildingCategories[i].Maintenances[j].Maintenance.id);
      }
    }
  }

  // #endregion

  const totalMaintenancesCount = await sharedMaintenanceservices.countPerCompanyId({
    companyId: req.Company.id,
  });

  // #endregion

  const BuildingDetails = await buildingServices.listDetails({ buildingId });

  return res.status(200).json({
    BuildingDetails,
    usedMaintenancesCount: usedBuildingMaintenancesIds.length,
    totalMaintenancesCount,
  });
}
