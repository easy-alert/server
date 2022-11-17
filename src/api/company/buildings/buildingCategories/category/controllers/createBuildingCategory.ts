// #region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../../utils/validator/validator';
import { BuildingCategoryServices } from '../services/buildingCategoryServices';
import { ICreateBuildingCategory } from '../services/types';

// CLASS

const validator = new Validator();
const buildingCategoryServices = new BuildingCategoryServices();

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
    console.log(bodyData[i]);
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
      message: `Edificação cadastrada com sucesso.`,
    },
  });
}
