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
import { defaultMaintenanceTemplateServices } from '../../../../shared/defaultMaintenanceTemplates/services/defaultMaintenanceTemplateServices';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

const buildingServices = new BuildingServices();
const validator = new Validator();
const categoryServices = new CategoryServices();

// #endregion

export async function isTemplate({
  templateId,
  currentBuildingId,
  companyId,
}: {
  templateId: string;
  currentBuildingId: string;
  companyId: string;
}) {
  const templateMaintenances = await defaultMaintenanceTemplateServices.findTemplateById({
    templateId,
  });

  if (!templateMaintenances) {
    throw new ServerMessage({ statusCode: 404, message: 'Template não encontrado.' });
  }

  const allCategoriesAndMaintenances = (await categoryServices.list({
    ownerCompanyId: companyId,
    search: '',
  })) as IListBuildingCategoriesAndMaintenances[];

  const buildingMaintenanceHistory = await buildingServices.listMaintenancesHistoryByBuilding({
    buildingId: currentBuildingId,
  });

  // #region PROCESS DATA

  for (let i = 0; i < allCategoriesAndMaintenances.length; i++) {
    for (let j = 0; j < allCategoriesAndMaintenances[i].Maintenances.length; j++) {
      const hasHistory = buildingMaintenanceHistory.some(
        (history) => history.maintenanceId === allCategoriesAndMaintenances[i].Maintenances[j].id,
      );

      allCategoriesAndMaintenances[i].Maintenances[j] = {
        ...allCategoriesAndMaintenances[i].Maintenances[j],
        isSelected: false,
        hasHistory,
      };
    }
  }

  for (let i = 0; i < allCategoriesAndMaintenances.length; i++) {
    for (let j = 0; j < allCategoriesAndMaintenances[i].Maintenances.length; j++) {
      for (let k = 0; k < templateMaintenances?.DefaultTemplateCategories.length; k++) {
        const isEquals = templateMaintenances?.DefaultTemplateCategories[
          k
        ].DefaultTemplateMaintenances.filter(
          (maintenance) =>
            maintenance.maintenanceId === allCategoriesAndMaintenances[i].Maintenances[j].id,
        );

        if (isEquals.length > 0) {
          allCategoriesAndMaintenances[i].Maintenances[j] = {
            ...allCategoriesAndMaintenances[i].Maintenances[j],
            isSelected: true,
          };
        }
      }
    }
  }

  // #endregion

  return allCategoriesAndMaintenances;
}

export async function isBuilding({
  buildingId,
  currentBuildingId,
  companyId,
}: {
  buildingId: string;
  currentBuildingId: string;
  companyId: string;
}) {
  await buildingServices.findById({
    buildingId,
  });

  const allCategoriesAndMaintenances = (await categoryServices.list({
    ownerCompanyId: companyId,
    search: '',
  })) as IListBuildingCategoriesAndMaintenances[];

  const buildingCategoriesAndMaintenances = await buildingServices.listMaintenances({
    buildingId,
  });

  const buildingMaintenanceHistory = await buildingServices.listMaintenancesHistoryByBuilding({
    buildingId: currentBuildingId,
  });

  // #region PROCESS DATA

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
      const hasHistory = buildingMaintenanceHistory.some(
        (history) => history.maintenanceId === allCategoriesAndMaintenances[i].Maintenances[j].id,
      );

      allCategoriesAndMaintenances[i].Maintenances[j] = {
        ...allCategoriesAndMaintenances[i].Maintenances[j],
        isSelected: false,
        hasHistory,
      };
    }
  }

  for (let i = 0; i < allCategoriesAndMaintenances.length; i++) {
    for (let j = 0; j < allCategoriesAndMaintenances[i].Maintenances.length; j++) {
      const isEquals = allBuildingCategoriesAndMaintenances.filter(
        (maintenance) => maintenance.id === allCategoriesAndMaintenances[i].Maintenances[j].id,
      );
      if (isEquals.length === 0) continue;

      allCategoriesAndMaintenances[i].Maintenances[j] = {
        ...allCategoriesAndMaintenances[i].Maintenances[j],
        isSelected: true,
      };
    }
  }

  // #endregion

  return allCategoriesAndMaintenances;
}

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

  const template = await defaultMaintenanceTemplateServices.findTemplateById({
    templateId: buildingId,
  });

  const building = await buildingServices.findById({
    buildingId: currentBuildingId,
  });

  // #endregion

  let CategoriesData = null;

  if (template) {
    CategoriesData = await isTemplate({
      templateId: buildingId,
      currentBuildingId,
      companyId: req.Company.id,
    });
  } else {
    CategoriesData = await isBuilding({
      buildingId,
      currentBuildingId,
      companyId: req.Company.id,
    });
  }

  return res.status(200).json({ buildingName: building?.name, CategoriesData });
}
