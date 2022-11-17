// #region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../../utils/validator/validator';
import { SharedCategoryServices } from '../../../../../shared/categories/category/services/sharedCategoryServices';
import { SharedMaintenanceServices } from '../../../../../shared/categories/maintenace/services/sharedMaintenanceServices';
import { BuildingCategoryServices } from '../services/buildingCategoryServices';
import { ICreateBuildingCategory } from '../services/types';

// CLASS

const validator = new Validator();
const buildingCategoryServices = new BuildingCategoryServices();
const sharedCategoryServices = new SharedCategoryServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
// #endregion

export async function createBuildingCategories(req: Request, res: Response) {
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

    await buildingCategoryServices.createCategoryAndMaintenances(data);
  }

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: `Manutenções cadastradas com sucesso.`,
    },
  });
}
