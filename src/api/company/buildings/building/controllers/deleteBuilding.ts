// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingServices } from '../services/buildingServices';

const validator = new Validator();
const buildingServices = new BuildingServices();

// #endregion

export async function deleteBuilding(req: Request, res: Response) {
  const { buildingId } = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  await buildingServices.findById({ buildingId });

  // #endregion

  await buildingServices.delete({ buildingId });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Edificação excluída com sucesso.`,
    },
  });
}
