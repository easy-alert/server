// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../../../../shared/maintenance/services/sharedMaintenanceServices';
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

  let BuildingDetails = await buildingServices.listDetails({ buildingId });

  if (BuildingDetails?.MaintenancesHistory) {
    const MaintenancesCount = [
      {
        name: 'completed',
        singularLabel: 'concluída',
        pluralLabel: 'concluídas',
        count: 0,
      },
      {
        name: 'pending',
        singularLabel: 'pendente',
        pluralLabel: 'pendentes',
        count: 0,
      },
      {
        name: 'expired',
        singularLabel: 'vencida',
        pluralLabel: 'vencidas',
        count: 0,
      },
    ];

    BuildingDetails.MaintenancesHistory.forEach((maintenance) => {
      switch (maintenance.MaintenancesStatus.name) {
        case 'completed':
          MaintenancesCount[0] = {
            ...MaintenancesCount[0],
            count: MaintenancesCount[0].count + 1,
          };
          break;

        case 'overdue':
          MaintenancesCount[0] = {
            ...MaintenancesCount[0],
            count: MaintenancesCount[0].count + 1,
          };
          break;

        case 'expired':
          MaintenancesCount[2] = {
            ...MaintenancesCount[2],
            count: MaintenancesCount[2].count + 1,
          };
          break;

        case 'pending':
          if (!maintenance.wasNotified) break;

          MaintenancesCount[1] = {
            ...MaintenancesCount[1],
            count: MaintenancesCount[1].count + 1,
          };
          break;

        default:
          break;
      }
    });

    BuildingDetails = {
      id: BuildingDetails.id,
      nanoId: BuildingDetails.nanoId,
      area: BuildingDetails.area,
      cep: BuildingDetails.cep,
      name: BuildingDetails.name,
      neighborhood: BuildingDetails.neighborhood,
      state: BuildingDetails.state,
      city: BuildingDetails.city,
      deliveryDate: BuildingDetails.deliveryDate,
      keepNotificationAfterWarrantyEnds: BuildingDetails.keepNotificationAfterWarrantyEnds,
      streetName: BuildingDetails.streetName,
      warrantyExpiration: BuildingDetails.warrantyExpiration,
      Annexes: BuildingDetails.Annexes,
      BuildingType: BuildingDetails.BuildingType,
      NotificationsConfigurations: BuildingDetails.NotificationsConfigurations,
      Banners: BuildingDetails.Banners,
      // @ts-ignore
      Folders:
        BuildingDetails.BuildingFolders?.length > 0
          ? BuildingDetails.BuildingFolders[0].BuildingFolder
          : null,
      MaintenancesCount,
    };
  }

  return res.status(200).json({
    BuildingDetails,
    usedMaintenancesCount: usedBuildingMaintenancesIds.length,
    totalMaintenancesCount,
  });
}
