// #region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';
import { SharedCategoryServices } from '../../../../shared/categories/category/services/sharedCategoryServices';
import { SharedMaintenanceServices } from '../../../../shared/categories/maintenace/services/sharedMaintenanceServices';
import { BuildingServices } from '../../building/services/buildingServices';
import { BuildingCategoryAndMaintenanceServices } from '../services/buildingCategoryAndMaintenaceServices';
import { ICreateBuildingCategory } from '../services/types';

// CLASS

const validator = new Validator();
const buildingCategoryAndMaintenanceServices = new BuildingCategoryAndMaintenanceServices();
const sharedCategoryServices = new SharedCategoryServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const buildingServices = new BuildingServices();
// #endregion

export async function editBuildingCategoriesAndMaintenaces(req: Request, res: Response) {
  const { buildingId } = req.body;
  const bodyData = req.body.data;

  // #region VALIDATIONS

  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  await buildingServices.findById({ buildingId });

  for (let i = 0; i < bodyData.length; i++) {
    validator.check([
      {
        label: 'ID da categoria',
        type: 'string',
        variable: bodyData[i].categoryId,
      },
    ]);

    await sharedCategoryServices.findById({ categoryId: bodyData[i].categoryId });

    for (let j = 0; j < bodyData[i].Maintenances.length; j++) {
      validator.check([
        {
          label: 'ID da manutenção',
          type: 'string',
          variable: bodyData[i].Maintenances[j].id,
        },
      ]);

      await sharedMaintenanceServices.findById({ maintenanceId: bodyData[i].Maintenances[j].id });
    }
  }

  // #endregion

  // #region DELETING OLD DATA
  const existsMaintenances = await buildingCategoryAndMaintenanceServices.findByBuldingId({
    buildingId,
  });

  if (existsMaintenances !== null) {
    await buildingCategoryAndMaintenanceServices.delteCategoriesAndMaintenances({ buildingId });
  }

  // #endregion

  // #region CREATING NEW DATA
  let data: ICreateBuildingCategory;

  for (let i = 0; i < bodyData.length; i++) {
    const maintenances = [];

    for (let j = 0; j < bodyData[i].Maintenances.length; j++) {
      maintenances.push({ maintenanceId: bodyData[i].Maintenances[j].id });
    }

    data = {
      buildingId,
      categoryId: bodyData[i].categoryId,
      Maintenances: {
        createMany: {
          data: maintenances,
        },
      },
    };

    await buildingCategoryAndMaintenanceServices.createCategoriesAndMaintenances(data);
  }

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Manutenções editadas com sucesso.`,
    },
  });
}
