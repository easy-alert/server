// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';

// CLASS
import { BuildingServices } from '../services/buildingServices';

const buildingServices = new BuildingServices();
const validator = new Validator();
// #endregion

export async function listBuildingDetailsMaintenances(req: Request, res: Response) {
  const { buildingId } = req.params;

  // #region VALIDATION

  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
  ]);

  const building = await buildingServices.findById({ buildingId });

  // #endregion

  let BuildingMaintenances = await buildingServices.listMaintenances({
    buildingId,
  });

  BuildingMaintenances = BuildingMaintenances.filter(
    (category: any) => category.Maintenances.length > 0,
  );

  return res.status(200).json({ buildingName: building?.name, BuildingMaintenances });
}
